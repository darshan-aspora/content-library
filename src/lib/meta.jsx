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

// Products are the database-backed categories (the indexed `pod` column). They
// are surfaced as the primary, always-visible header tabs — the spine of the
// Mobbin-style navigation. `accent` tints the active tab + card chip.
export const productMeta = {
  gold: { label: "Gold", accent: "#d9a441" },
  remittance: { label: "Remittance", accent: "#0b5cff" },
  nri: { label: "NRI Banking", accent: "#10b981" },
  general: { label: "Brand Kit", accent: "#64748b" },
};

// Tab order for the header. `all` is synthetic (no pod filter).
export const PRODUCTS = [
  { id: "all", label: "All" },
  { id: "gold", label: "Gold" },
  { id: "remittance", label: "Remittance" },
  { id: "nri", label: "NRI Banking" },
  { id: "general", label: "Brand Kit" },
];

// Sub-categories ("sections") shown as chips under each product tab. Keyed by
// pod; `id` matches the Asset.section value, `label` is the chip text. Kept in
// sync with prisma/data/sections.js (the seed/backfill side).
export const sectionsByPod = {
  gold: [
    { id: "explore", label: "Explore" },
    { id: "buy", label: "Buy" },
    { id: "sell", label: "Sell" },
    { id: "leasing", label: "Leasing" },
  ],
  remittance: [
    { id: "add-recipient", label: "Add recipient" },
    { id: "send-money", label: "Send money" },
  ],
  general: [
    { id: "logo", label: "Logo" },
    { id: "favicon", label: "Favicon" },
    { id: "icon", label: "Icon" },
  ],
  nri: [
    { id: "pre-journey", label: "Pre-journey" },
    { id: "the-journey", label: "The Journey" },
    { id: "kyc", label: "KYC" },
    { id: "tax", label: "Tax" },
    { id: "nominee", label: "Nominee" },
    { id: "review-confirm", label: "Review & Confirm" },
    { id: "account-home", label: "Account & Switching" },
    { id: "account-details", label: "Account Details" },
    { id: "adding-money", label: "Adding Money" },
    { id: "sending-money", label: "Sending Money" },
    { id: "statement", label: "Statement" },
    { id: "mpin", label: "MPIN" },
  ],
};

export const facets = {
  pod: [
    { id: "general", label: "Brand Kit" },
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
