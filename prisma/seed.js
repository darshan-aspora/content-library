import { PrismaClient } from "@prisma/client";
import crypto from "node:crypto";

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

// Seed accounts (no email verification for now).
// Passwords are read from environment variables so no secret ever lives in the
// repo. Set them in your local .env (and in Vercel) before seeding, e.g.:
//   SEED_SUPERADMIN_PASSWORD, SEED_USER1_PASSWORD, SEED_USER2_PASSWORD, SEED_USER3_PASSWORD
// If a variable is missing the user is skipped (so a partial .env never wipes
// an existing account's password with an empty value).
const users = [
  { name: "Darshan Suthar", email: "darshan.suthar@aspora.com", password: process.env.SEED_SUPERADMIN_PASSWORD, role: "superadmin" },
  { name: "Priya Nair", email: "priya.nair@aspora.com", password: process.env.SEED_USER1_PASSWORD, role: "user" },
  { name: "Arjun Menon", email: "arjun.menon@aspora.com", password: process.env.SEED_USER2_PASSWORD, role: "user" },
  { name: "Meera Pillai", email: "meera.pillai@aspora.com", password: process.env.SEED_USER3_PASSWORD, role: "user" },
];

// Information architecture: top-level pillars + their subfolders.
const tree = [
  { code: "00", name: "Start Here", slug: "start-here", note: "Aspora overview, dos & don'ts, general guidelines", children: [] },
  {
    code: "01",
    name: "Content Script Kit",
    slug: "script-kit",
    note: "What to say and how to say it",
    children: [
      { name: "General idea", slug: "script-general", note: "What content works, taglines" },
      { name: "Non-finance focused", slug: "script-nonfinance", note: "Emotional connect, easy metaphors" },
      { name: "Finance focused", slug: "script-finance", note: "Logical connect, heavier terms" },
    ],
  },
  {
    code: "02",
    name: "App Images & Videos",
    slug: "app-media",
    note: "High-fidelity screens & recordings",
    children: [
      { name: "Most common journeys", slug: "journeys-common", note: "Success, first purchase, account opening" },
      { name: "Remittance", slug: "pod-remittance", note: "POD-specific journeys" },
      { name: "Gold", slug: "pod-gold", note: "POD-specific journeys" },
      { name: "NRI Banking", slug: "pod-nri", note: "POD-specific journeys" },
    ],
  },
  {
    code: "03",
    name: "Graphics",
    slug: "graphics",
    note: "Templates, platform-ready visuals, trust markers",
    children: [
      { name: "Templates", slug: "gfx-templates", note: "Canva & editing-tool templates" },
      { name: "Instagram", slug: "gfx-insta", note: "Platform-specific dimensions" },
      { name: "X (Twitter)", slug: "gfx-x", note: "Platform-specific dimensions" },
      { name: "YouTube", slug: "gfx-youtube", note: "Platform-specific dimensions" },
      { name: "Trust markers", slug: "gfx-trust", note: "Reviews, 1M+ downloads visuals" },
    ],
  },
];

// A few metadata-only sample assets (no file yet) so the library isn't empty.
const sampleAssets = [
  { title: "Campaign Guidelines", slug: "start-here", type: "pdf", pod: "general", creatorType: "any", description: "Short overview of Aspora, brand dos & don'ts, and posting guidelines. Read first.", tags: ["guidelines", "brand", "onboarding"] },
  { title: "Hooks & taglines that work", slug: "script-general", type: "script", pod: "general", creatorType: "any", description: "Proven opening hooks and taglines to adapt to your voice.", tags: ["hook", "tagline", "caption"] },
  { title: "Sending money home — emotional angle", slug: "script-nonfinance", type: "script", pod: "remittance", creatorType: "non-finance", description: "Story-led script using everyday metaphors — family, festivals.", tags: ["emotional", "family", "remittance"] },
  { title: "Why FX rates matter — logical breakdown", slug: "script-finance", type: "script", pod: "remittance", creatorType: "finance", description: "CA-style explainer comparing mid-market vs bank rates.", tags: ["fx", "rates", "comparison"] },
  { title: "Account opening — full flow", slug: "journeys-common", type: "video", pod: "general", creatorType: "any", description: "Screen recording of the end-to-end signup and KYC flow.", tags: ["account opening", "kyc", "onboarding"] },
  { title: "Payment success — confirmation moment", slug: "journeys-common", type: "gif", pod: "general", creatorType: "any", description: "Looping success checkmark animation — punchy ending for reels.", tags: ["success", "confirmation", "loop"] },
  { title: "First transfer — happy path (Malayalam)", slug: "journeys-common", type: "video", pod: "general", language: "ml", creatorType: "any", description: "Malayalam UI walkthrough of a first money transfer, for UAE.", tags: ["first purchase", "transfer", "malayalam"] },
  { title: "Remittance — money delivered", slug: "pod-remittance", type: "video", pod: "remittance", creatorType: "any", description: "Recording from initiation to 'delivered' status with timeline.", tags: ["remittance", "delivered", "timeline"] },
  { title: "Gold — buy 24K in seconds", slug: "pod-gold", type: "video", pod: "gold", creatorType: "any", description: "Screen recording of a digital gold purchase and holdings update.", tags: ["gold", "buy", "24k"] },
  { title: "NRI Banking — account dashboard", slug: "pod-nri", type: "image", pod: "nri", creatorType: "any", description: "Dashboard view of NRI account balances and quick actions.", tags: ["nri", "banking", "dashboard"] },
  { title: "Canva reel template — savings story", slug: "gfx-templates", type: "template", pod: "remittance", platform: "instagram", creatorType: "any", description: "Editable Canva template for a 3-slide savings story.", tags: ["canva", "template", "reel"] },
  { title: "IG story badge — Trustpilot 4.6", slug: "gfx-insta", type: "graphic", pod: "general", platform: "instagram", creatorType: "any", description: "Animated Trustpilot 4.6 (UK) badge in brand colors, story-sized.", tags: ["trustpilot", "badge", "social proof"] },
  { title: "X post card — rate comparison", slug: "gfx-x", type: "graphic", pod: "remittance", platform: "x", creatorType: "finance", description: "16:9 graphic comparing Aspora vs Wise/Revolut on fees.", tags: ["comparison", "wise", "revolut"] },
  { title: "1M+ downloads visual", slug: "gfx-trust", type: "graphic", pod: "general", creatorType: "any", description: "Bold milestone graphic — '1M+ downloads' in brand colors.", tags: ["trust", "downloads", "milestone"] },
];

// ~54 additional assets spread across every category for a fuller library.
const moreAssets = [
  // 01 — General idea
  { title: "Reel structure: hook → value → CTA", slug: "script-general", type: "script", pod: "general", creatorType: "any", description: "A repeatable 3-beat reel skeleton you can drop any topic into.", tags: ["reel", "structure", "hook", "cta"] },
  { title: "Caption formulas that convert", slug: "script-general", type: "script", pod: "general", creatorType: "any", description: "Fill-in-the-blank caption templates with strong openers.", tags: ["caption", "formula", "copy"] },
  { title: "Trending audio pairing ideas", slug: "script-general", type: "script", pod: "general", creatorType: "non-finance", description: "How to map trending sounds to finance topics without feeling forced.", tags: ["audio", "trending", "reel"] },
  { title: "Story arc for finance content", slug: "script-general", type: "script", pod: "general", creatorType: "finance", description: "Problem → tension → resolution arc tuned for money topics.", tags: ["story", "arc", "structure"] },

  // 01 — Non-finance focused
  { title: "Diwali gifting money story", slug: "script-nonfinance", type: "script", pod: "remittance", creatorType: "non-finance", description: "Festival-led emotional script about sending gifts home.", tags: ["diwali", "festival", "emotional"] },
  { title: "Mom's first smartphone transfer", slug: "script-nonfinance", type: "script", pod: "remittance", language: "ml", creatorType: "non-finance", description: "Warm Malayalam-friendly story about teaching a parent to receive money.", tags: ["family", "malayalam", "emotional"] },
  { title: "Festival remittance metaphor pack", slug: "script-nonfinance", type: "script", pod: "remittance", creatorType: "non-finance", description: "A set of easy metaphors for explaining transfers warmly.", tags: ["metaphor", "remittance", "emotional"] },
  { title: "Studying abroad: staying connected", slug: "script-nonfinance", type: "script", pod: "general", creatorType: "non-finance", description: "Student-life angle on supporting family across borders.", tags: ["student", "abroad", "family"] },
  { title: "Wedding savings narrative", slug: "script-nonfinance", type: "script", pod: "gold", creatorType: "non-finance", description: "Saving in gold for a wedding — emotional, aspirational framing.", tags: ["wedding", "gold", "savings"] },

  // 01 — Finance focused
  { title: "Compounding explained with chai", slug: "script-finance", type: "script", pod: "gold", creatorType: "finance", description: "Everyday analogy script for compounding returns.", tags: ["compounding", "explainer", "analogy"] },
  { title: "NRE vs NRO accounts breakdown", slug: "script-finance", type: "script", pod: "nri", creatorType: "finance", description: "Clear comparison of NRE and NRO with use-cases.", tags: ["nre", "nro", "comparison"] },
  { title: "Tax on remittances FAQ", slug: "script-finance", type: "script", pod: "remittance", creatorType: "finance", description: "Common tax questions on inbound/outbound transfers.", tags: ["tax", "remittance", "faq"] },
  { title: "SIP vs digital gold comparison", slug: "script-finance", type: "script", pod: "gold", creatorType: "finance", description: "Side-by-side logic for recurring gold vs mutual-fund SIP.", tags: ["sip", "gold", "comparison"] },
  { title: "Forex spread math, simplified", slug: "script-finance", type: "script", pod: "remittance", creatorType: "finance", description: "How spreads quietly cost you, with a worked example.", tags: ["forex", "spread", "math"] },

  // 02 — Most common journeys
  { title: "Splash to home screen", slug: "journeys-common", type: "video", pod: "general", creatorType: "any", description: "Clean open of the app landing on the home dashboard.", tags: ["home", "launch", "screen"] },
  { title: "KYC document upload step", slug: "journeys-common", type: "video", pod: "general", creatorType: "any", description: "Recording of the ID upload and verification step.", tags: ["kyc", "verification", "upload"] },
  { title: "Add a new recipient", slug: "journeys-common", type: "video", pod: "general", creatorType: "any", description: "Flow for adding a beneficiary before a transfer.", tags: ["recipient", "beneficiary", "flow"] },
  { title: "Transaction history view", slug: "journeys-common", type: "image", pod: "general", creatorType: "any", description: "Screenshot of a clean, itemised transaction history.", tags: ["history", "transactions", "screen"] },
  { title: "Notification: money received", slug: "journeys-common", type: "gif", pod: "general", creatorType: "any", description: "Push notification animation for an incoming transfer.", tags: ["notification", "received", "animation"] },
  { title: "Profile & security settings", slug: "journeys-common", type: "image", pod: "general", creatorType: "any", description: "Security settings screen — 2FA, biometrics, devices.", tags: ["security", "settings", "profile"] },

  // 02 — Remittance
  { title: "Remittance: choose payout method", slug: "pod-remittance", type: "image", pod: "remittance", creatorType: "any", description: "Bank, UPI, or cash pickup selection screen.", tags: ["payout", "method", "remittance"] },
  { title: "Remittance: fee breakdown screen", slug: "pod-remittance", type: "image", pod: "remittance", creatorType: "finance", description: "Transparent fee + rate breakdown before confirm.", tags: ["fees", "breakdown", "transparency"] },
  { title: "Remittance: live rate ticker", slug: "pod-remittance", type: "gif", pod: "remittance", creatorType: "any", description: "Animated live FX rate updating in real time.", tags: ["rate", "live", "ticker"] },
  { title: "Remittance: recurring transfer setup", slug: "pod-remittance", type: "video", pod: "remittance", creatorType: "any", description: "Setting up an automatic monthly transfer home.", tags: ["recurring", "automation", "transfer"] },
  { title: "Remittance: cash pickup option", slug: "pod-remittance", type: "image", pod: "remittance", language: "ml", creatorType: "any", description: "Cash pickup selection, Malayalam UI for UAE corridor.", tags: ["cash pickup", "malayalam", "uae"] },
  { title: "Remittance: referral reward", slug: "pod-remittance", type: "graphic", pod: "remittance", creatorType: "any", description: "Refer-a-friend reward visual for transfers.", tags: ["referral", "reward", "growth"] },

  // 02 — Gold
  { title: "Gold: live price chart", slug: "pod-gold", type: "image", pod: "gold", creatorType: "finance", description: "Screenshot of the 24K live price chart with ranges.", tags: ["gold", "price", "chart"] },
  { title: "Gold: SIP setup", slug: "pod-gold", type: "video", pod: "gold", creatorType: "finance", description: "Setting up a recurring daily/weekly gold buy.", tags: ["gold", "sip", "recurring"] },
  { title: "Gold: sell & redeem", slug: "pod-gold", type: "video", pod: "gold", creatorType: "any", description: "Selling digital gold and instant payout flow.", tags: ["gold", "sell", "redeem"] },
  { title: "Gold: vault storage explainer", slug: "pod-gold", type: "video", pod: "gold", creatorType: "any", description: "How insured vault storage works, on-screen.", tags: ["gold", "vault", "storage"] },
  { title: "Gold: gifting gold", slug: "pod-gold", type: "graphic", pod: "gold", creatorType: "non-finance", description: "Gift digital gold visual for festive moments.", tags: ["gold", "gift", "festival"] },
  { title: "Gold: purity certificate", slug: "pod-gold", type: "image", pod: "gold", creatorType: "any", description: "24K purity certificate screen for trust building.", tags: ["gold", "purity", "certificate"] },

  // 02 — NRI Banking
  { title: "NRI: fixed deposit booking", slug: "pod-nri", type: "video", pod: "nri", creatorType: "finance", description: "Booking an NRI fixed deposit, end to end.", tags: ["nri", "fd", "deposit"] },
  { title: "NRI: NRE account funding", slug: "pod-nri", type: "image", pod: "nri", creatorType: "any", description: "Funding an NRE account from abroad — screen.", tags: ["nri", "nre", "funding"] },
  { title: "NRI: repatriation flow", slug: "pod-nri", type: "video", pod: "nri", creatorType: "finance", description: "Repatriating funds out of India, step by step.", tags: ["nri", "repatriation", "flow"] },
  { title: "NRI: debit card management", slug: "pod-nri", type: "image", pod: "nri", creatorType: "any", description: "Freeze, limits and controls on the NRI card.", tags: ["nri", "card", "controls"] },
  { title: "NRI: bill payments in India", slug: "pod-nri", type: "video", pod: "nri", creatorType: "any", description: "Paying India utility bills from an NRI account.", tags: ["nri", "bills", "payments"] },

  // 03 — Templates
  { title: "Canva story template — rate alert", slug: "gfx-templates", type: "template", pod: "remittance", platform: "instagram", creatorType: "any", description: "Editable story template announcing a great rate.", tags: ["canva", "story", "rate"] },
  { title: "Canva post — gold milestone", slug: "gfx-templates", type: "template", pod: "gold", platform: "instagram", creatorType: "any", description: "Square post celebrating a gold savings milestone.", tags: ["canva", "post", "gold"] },
  { title: "CapCut reel template — remittance", slug: "gfx-templates", type: "template", pod: "remittance", creatorType: "any", description: "CapCut project for a fast remittance explainer reel.", tags: ["capcut", "reel", "template"] },
  { title: "YouTube thumbnail template pack", slug: "gfx-templates", type: "template", pod: "general", platform: "youtube", creatorType: "any", description: "Editable high-CTR thumbnail layouts.", tags: ["thumbnail", "pack", "template"] },

  // 03 — Instagram
  { title: "IG reel cover — savings", slug: "gfx-insta", type: "graphic", pod: "remittance", platform: "instagram", creatorType: "any", description: "On-brand reel cover for savings content.", tags: ["reel cover", "savings", "instagram"] },
  { title: "IG carousel frame set", slug: "gfx-insta", type: "graphic", pod: "general", platform: "instagram", creatorType: "any", description: "Matched carousel frames (intro/body/CTA).", tags: ["carousel", "frames", "instagram"] },
  { title: "IG story poll sticker pack", slug: "gfx-insta", type: "graphic", pod: "general", platform: "instagram", creatorType: "any", description: "Branded poll/question sticker overlays.", tags: ["story", "stickers", "engagement"] },

  // 03 — X (Twitter)
  { title: "X header — brand", slug: "gfx-x", type: "graphic", pod: "general", platform: "x", creatorType: "any", description: "Profile header sized for X, brand colors.", tags: ["header", "profile", "brand"] },
  { title: "X thread divider cards", slug: "gfx-x", type: "graphic", pod: "general", platform: "x", creatorType: "finance", description: "Numbered divider cards to structure a thread.", tags: ["thread", "divider", "cards"] },

  // 03 — YouTube
  { title: "YT end screen template", slug: "gfx-youtube", type: "graphic", pod: "general", platform: "youtube", creatorType: "any", description: "Subscribe + next-video end screen layout.", tags: ["end screen", "subscribe", "youtube"] },
  { title: "YT lower-third pack", slug: "gfx-youtube", type: "graphic", pod: "general", platform: "youtube", creatorType: "any", description: "Name/title lower-thirds in brand style.", tags: ["lower third", "overlay", "youtube"] },
  { title: "YT community post graphic", slug: "gfx-youtube", type: "graphic", pod: "general", platform: "youtube", creatorType: "any", description: "Community-tab announcement graphic.", tags: ["community", "post", "youtube"] },

  // 03 — Trust markers
  { title: "Trustpilot 4.6 animated badge", slug: "gfx-trust", type: "graphic", pod: "general", creatorType: "any", description: "Animated 4.6 (UK) Trustpilot badge for stories.", tags: ["trustpilot", "badge", "animated"] },
  { title: "App Store rating card", slug: "gfx-trust", type: "graphic", pod: "general", creatorType: "any", description: "App Store star-rating card in brand colors.", tags: ["app store", "rating", "social proof"] },
  { title: "Google Play 4.7 badge", slug: "gfx-trust", type: "graphic", pod: "general", creatorType: "any", description: "Play Store rating badge for posts and stories.", tags: ["google play", "rating", "badge"] },
  { title: "Featured-in press logos", slug: "gfx-trust", type: "graphic", pod: "general", creatorType: "any", description: "Press/feature logo strip for credibility.", tags: ["press", "logos", "credibility"] },
  { title: "Customer testimonial reel", slug: "gfx-trust", type: "video", pod: "general", creatorType: "non-finance", description: "Short reel stitching real customer quotes.", tags: ["testimonial", "reel", "social proof"] },
];

async function main() {
  console.log("Seeding…");

  const slugToId = {};

  for (let i = 0; i < tree.length; i++) {
    const pillar = tree[i];
    const created = await prisma.category.upsert({
      where: { slug: pillar.slug },
      update: { code: pillar.code, name: pillar.name, note: pillar.note, order: i },
      create: { code: pillar.code, name: pillar.name, slug: pillar.slug, note: pillar.note, order: i },
    });
    slugToId[pillar.slug] = created.id;

    for (let j = 0; j < pillar.children.length; j++) {
      const child = pillar.children[j];
      const c = await prisma.category.upsert({
        where: { slug: child.slug },
        update: { name: child.name, note: child.note, order: j, parentId: created.id },
        create: { name: child.name, slug: child.slug, note: child.note, order: j, parentId: created.id },
      });
      slugToId[child.slug] = c.id;
    }
  }

  for (const a of [...sampleAssets, ...moreAssets]) {
    const categoryId = slugToId[a.slug];
    if (!categoryId) continue;
    const exists = await prisma.asset.findFirst({ where: { title: a.title } });
    if (exists) continue;
    await prisma.asset.create({
      data: {
        title: a.title,
        description: a.description,
        type: a.type,
        pod: a.pod ?? "general",
        platform: a.platform ?? "all",
        language: a.language ?? "en",
        creatorType: a.creatorType ?? "any",
        categoryId,
        tags: {
          connectOrCreate: a.tags.map((name) => ({ where: { name }, create: { name } })),
        },
      },
    });
  }

  // Users — upsert by email so re-seeding refreshes passwords/roles idempotently.
  // Skip any user whose password env var is unset so we never write an empty hash.
  let seededUsers = 0;
  for (const u of users) {
    if (!u.password) {
      console.warn(`Skipping ${u.email}: no password env var set.`);
      continue;
    }
    await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, role: u.role, passwordHash: hashPassword(u.password) },
      create: {
        name: u.name,
        email: u.email,
        role: u.role,
        passwordHash: hashPassword(u.password),
      },
    });
    seededUsers++;
  }
  if (seededUsers === 0) {
    console.warn("No user passwords found in env — skipped all account seeding.");
  }

  const cats = await prisma.category.count();
  const assets = await prisma.asset.count();
  const userCount = await prisma.user.count();
  console.log(`Done. Categories: ${cats}, Assets: ${assets}, Users: ${userCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
