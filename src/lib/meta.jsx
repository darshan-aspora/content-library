// Presentation metadata + filter vocabularies shared by the public and admin UIs.

export const typeMeta = {
  pdf: { label: "PDF", emoji: "📄", accent: "#ef4444" },
  script: { label: "Script", emoji: "📝", accent: "#8b5cf6" },
  image: { label: "Image", emoji: "🖼️", accent: "#0ea5e9" },
  video: { label: "Video", emoji: "🎬", accent: "#f59e0b" },
  gif: { label: "GIF", emoji: "✨", accent: "#ec4899" },
  template: { label: "Template", emoji: "🧩", accent: "#10b981" },
  graphic: { label: "Graphic", emoji: "🎨", accent: "#6366f1" },
};

export const facets = {
  pod: [
    { id: "general", label: "General" },
    { id: "remittance", label: "Remittance" },
    { id: "gold", label: "Gold" },
    { id: "nri", label: "NRI Banking" },
  ],
  platform: [
    { id: "all", label: "All platforms" },
    { id: "instagram", label: "Instagram" },
    { id: "x", label: "X (Twitter)" },
    { id: "youtube", label: "YouTube" },
  ],
  language: [
    { id: "en", label: "English" },
    { id: "ml", label: "Malayalam" },
  ],
  creatorType: [
    { id: "any", label: "Any creator" },
    { id: "finance", label: "Finance / logical" },
    { id: "non-finance", label: "Non-finance / emotional" },
  ],
  type: [
    { id: "pdf", label: "PDF" },
    { id: "script", label: "Script" },
    { id: "image", label: "Image" },
    { id: "video", label: "Video" },
    { id: "gif", label: "GIF" },
    { id: "template", label: "Template" },
    { id: "graphic", label: "Graphic" },
  ],
};

export const labelOf = (facet, id) =>
  facets[facet]?.find((o) => o.id === id)?.label ?? id;

export function formatBytes(bytes) {
  if (!bytes) return "";
  const units = ["B", "KB", "MB", "GB"];
  let n = bytes;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

// Build a pillars->children tree from the flat category list.
export function buildTree(categories) {
  const byId = {};
  categories.forEach((c) => (byId[c.id] = { ...c, children: [] }));
  const roots = [];
  categories.forEach((c) => {
    if (c.parentId && byId[c.parentId]) byId[c.parentId].children.push(byId[c.id]);
    else roots.push(byId[c.id]);
  });
  return roots;
}
