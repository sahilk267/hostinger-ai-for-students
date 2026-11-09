import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { requireSameOriginApi } from "./sameOrigin";
import { validateProductionSecurityConfig } from "./runtimeSecurity";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  // Reject unsafe production configuration before binding a public listener.
  // Only fixed identifiers are logged; never credentials or configured values.
  const issues = validateProductionSecurityConfig(process.env);
  if (issues.length) {
    throw new Error("Production security configuration invalid: " + issues.join(", "));
  }
  const app = express();
  const server = createServer(app);
  // Liveness does not depend on database availability, and reveals no configuration.
  // The CI smoke test uses this endpoint to verify the compiled Express app boots.
  app.get("/healthz", (_req, res) => {
    res.set("Cache-Control", "no-store");
    res.status(200).json({ status: "ok" });
  });
  // No uploads are accepted on these routes. Bound untrusted request bodies
  // before parsing so a client cannot cheaply allocate 50 MB per request.
  app.use(express.json({ limit: "512kb" }));
  app.use(express.urlencoded({ limit: "64kb", extended: true }));
  // Account exports and tRPC queries can contain private records. They must
  // never be cached by browsers, a CDN or a reverse proxy.
  app.use("/api", (_req, res, next) => {
    res.set("Cache-Control", "private, no-store");
    res.set("X-Content-Type-Options", "nosniff");
    next();
  });
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    requireSameOriginApi,
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const rawPort = process.env.PORT ?? "3000";
  const preferredPort = Number(rawPort);
  if (!Number.isInteger(preferredPort) || preferredPort < 1 || preferredPort > 65535) {
    throw new Error("PORT must be a valid TCP port number");
  }
  // Managed Node.js reverse proxies require the exact configured port.
  // Only local development may fall back, and production errors fail visibly.
  const port = process.env.NODE_ENV === "production"
    ? preferredPort : await findAvailablePort(preferredPort);
  if (port !== preferredPort) console.log(`Dev port ${preferredPort} busy; using ${port}`);
  server.on("error", error => {
    console.error("[Server] Failed to bind configured port:", error);
    process.exitCode = 1;
  });
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer().catch(error => {
  console.error("[Server] Startup failed:", error);
  process.exitCode = 1;
});
