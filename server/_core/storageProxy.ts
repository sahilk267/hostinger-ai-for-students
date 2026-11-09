import type { Express } from "express";
import { ENV } from "./env";

/**
 * Previously this route used a privileged server token to presign any
 * caller-supplied storage path. Only explicitly designated public assets may
 * be served, and only after the operator has reviewed the public prefix.
 */
export function isAllowedPublicStorageKey(key: string, prefix: string) {
  if (!/^[A-Za-z0-9][A-Za-z0-9/_-]{1,127}\/$/.test(prefix)) return false;
  if (!key.startsWith(prefix) || key.length <= prefix.length) return false;
  if (key.includes("..") || key.includes("//") || key.includes("\\")
    || key.includes("%") || key.includes("?") || key.includes("#")) return false;
  return /^[A-Za-z0-9/_.-]+$/.test(key);
}

export function registerStorageProxy(app: Express) {
  app.get("/manus-storage/*", async (req, res) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    // No public signing endpoint unless explicitly approved, with an
    // independent allowlisted public-only prefix.
    if (process.env.MANUS_STORAGE_PROXY_ENABLED !== "1") {
      res.status(404).send("Not found");
      return;
    }
    if (!isAllowedPublicStorageKey(key, process.env.MANUS_STORAGE_PUBLIC_PREFIX ?? "")) {
      res.status(403).send("Storage key is not public");
      return;
    }

    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }

    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/",
      );
      forgeUrl.searchParams.set("path", key);

      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` },
      });

      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }

      const { url } = (await forgeResp.json()) as { url: string };
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }

      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}
