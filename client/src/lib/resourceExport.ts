/** Download a locally generated UTF-8 resource without sending any learner data to a server. */
export function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  } finally {
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

/** Print only the resource via a dedicated temporary print window. */
export function printPlainText(title: string, content: string) {
  const tab = window.open("", "_blank", "noopener,noreferrer,width=800,height=800");
  if (!tab) return false;
  const escape = (value: string) => value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return entities[character] ?? character;
  });
  tab.document.open();
  tab.document.write(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${escape(title)}</title><style>body{font-family:system-ui,sans-serif;max-width:780px;margin:35px auto;padding:0 18px;color:#222;line-height:1.55}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit}h1{font-size:1.5rem}@media print{body{margin:0;max-width:none}}</style></head><body><h1>${escape(title)}</h1><pre>${escape(content)}</pre></body></html>`);
  tab.document.close();
  tab.focus();
  tab.print();
  return true;
}
