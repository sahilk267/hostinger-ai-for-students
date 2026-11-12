import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";
import { spaPathFromOriginalUrl, isKnownSpaPath, isPrivateSpaPath } from "./spaRoutes";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));

  // Only known client-side routes should return the application shell.
  // Unknown HTML routes and missing files must return HTTP 404 (not a soft-404 200).
  app.use("*", (req, res) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      return res.status(404).end();
    }
    const pathname = spaPathFromOriginalUrl(req.originalUrl);
    const known = isKnownSpaPath(pathname);
    if (!known) {
      if (req.accepts("html") && !pathname.includes(".")) {
        return res.status(404).type("html").send(
          '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Page not found | AI for Students</title></head><body><main><h1>Page not found</h1><p>This page is unavailable.</p><a href="/">Return to AI for Students</a></main></body></html>'
        );
      }
      return res.status(404).end();
    }
    // Personal and result routes should not return a public homepage canonical.
    const privateRoute = isPrivateSpaPath(pathname);
    if (privateRoute) {
      const html = fs.readFileSync(path.resolve(distPath, "index.html"), "utf8")
        .replace(/<meta name="robots"[^>]*>/i, '<meta name="robots" content="noindex,nofollow">')
        .replace(/<link rel="canonical"[^>]*>/i, "")
        .replace(/<meta property="og:url"[^>]*>/i, "");
      return res.type("html").send(html);
    }
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
