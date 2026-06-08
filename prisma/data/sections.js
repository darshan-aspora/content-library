// Sub-category ("section") taxonomy per pod. Sections are a second level of
// tagging under the product tabs: when a pod is active in the library, its
// sections render as chips; selecting one filters the grid to that section.
//
// `sectionsByPod` drives the UI (id = stored value on Asset.section, label =
// chip text). `sectionFor({ pod, tags, title })` derives the right section for
// an asset from the tags/title we already seed — used by seed.js and the
// backfill script (prisma/set-sections.js) so existing rows get classified.

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

// Helper list of valid section ids for a pod (used for validation/UX).
export const sectionIds = Object.fromEntries(
  Object.entries(sectionsByPod).map(([pod, list]) => [pod, list.map((s) => s.id)])
);

// Derive a section for an asset from its pod + tags + title (+ type).
// Returns "" when nothing matches (asset stays unsectioned / "All").
export function sectionFor({ pod, tags = [], title = "", type = "" }) {
  const t = new Set(tags.map((s) => String(s).toLowerCase()));
  const has = (...names) => names.some((n) => t.has(n));
  const titleL = String(title).toLowerCase();

  if (pod === "gold") {
    // Authored scripts/templates aren't part of the screen-based sub-flows, so
    // they stay unsectioned (visible under "All", no chip).
    if (type === "script" || type === "template") return "";
    // A leasing/buy/sell flow takes precedence over the generic "explore"
    // landing/vault/portfolio bucket. Match tags first, then the title.
    if (has("leasing") || /leas/.test(titleL)) return "leasing";
    if (has("buy") || /\bbuy\b/.test(titleL)) return "buy";
    if (has("sell") || /\bsell\b/.test(titleL)) return "sell";
    if (has("landing-page", "vault", "portfolio", "returns", "invest", "holdings", "comparison", "breakdown"))
      return "explore";
    return "";
  }

  if (pod === "remittance") {
    if (has("add-recipient")) return "add-recipient";
    if (has("send-money")) return "send-money";
    return "";
  }

  if (pod === "general") {
    if (has("favicon")) return "favicon";
    if (has("icon")) return "icon";
    if (has("logo", "wordmark")) return "logo";
    return "";
  }

  if (pod === "nri") {
    // Each NRI screen carries its section id as a tag (see data/nri-screens.js).
    for (const s of sectionsByPod.nri) if (t.has(s.id)) return s.id;
    return "";
  }

  return "";
}
