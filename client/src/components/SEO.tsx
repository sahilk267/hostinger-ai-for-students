import { useEffect } from "react";

const SITE_URL = "https://aiforstudents.in";
type Props = { title: string; description: string; path: string; type?: "website" | "article"; jsonLd?: Record<string, unknown> };

function updateMeta(selector: string, attribute: "name" | "property", key: string, value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = value;
}

export function SEO({ title, description, path, type = "website", jsonLd }: Props) {
  useEffect(() => {
    const oldTitle = document.title;
    const canonical = SITE_URL + (path === "/" ? "/" : path);
    document.title = `${title} | AI for Students`;
    updateMeta('meta[name="description"]', "name", "description", description);
    updateMeta('meta[property="og:title"]', "property", "og:title", document.title);
    updateMeta('meta[property="og:description"]', "property", "og:description", description);
    updateMeta('meta[property="og:type"]', "property", "og:type", type);
    updateMeta('meta[property="og:url"]', "property", "og:url", canonical);
    updateMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary");
    updateMeta('meta[name="twitter:title"]', "name", "twitter:title", document.title);
    updateMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
    link.href = canonical;
    const existing = document.getElementById("aifs-jsonld");
    existing?.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.id = "aifs-jsonld";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
    return () => {
      document.title = oldTitle;
      document.getElementById("aifs-jsonld")?.remove();
    };
  }, [title, description, path, type, jsonLd]);
  return null;
}
