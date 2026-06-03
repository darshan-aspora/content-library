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
    note: "High-fidelity app screens & recordings, organised by file type",
    children: [
      { name: "Images", slug: "app-images", note: "Screenshots & static screen designs" },
      { name: "Videos", slug: "app-videos", note: "Screen recordings & motion" },
      { name: "PDFs", slug: "app-pdfs", note: "Flow docs & exportable guides" },
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

// 02 — App Images & Videos. Real app screens from the Gold + Leasing flows.
// These are static UI designs, so they live under the "Images" subfolder
// (slug app-images); the section/feature lives in tags for filtering. Videos
// and PDFs subfolders start empty and fill as that content arrives.
const appScreens = [
  // Gold — Landing Page
  { title: "Gold — Landing page header", slug: "app-images", type: "image", pod: "gold", description: "Invest in 24K gold — landing hero with key benefits (free storage & insurance, 0% VAT, withdraw anytime).", tags: ["gold", "landing-page", "invest", "screen"] },
  { title: "Gold — Comparison across asset classes", slug: "app-images", type: "image", pod: "gold", description: "Past-returns calculator comparing gold vs fixed deposit vs cash over 6M–5Y.", tags: ["gold", "landing-page", "comparison", "returns", "screen"] },

  // Gold — Vault + Portfolio
  { title: "Gold — Vault", slug: "app-images", type: "image", pod: "gold", description: "Vault view showing total gold holdings in grams with current value and change.", tags: ["gold", "vault", "holdings", "screen"] },
  { title: "Gold — Portfolio breakdown", slug: "app-images", type: "image", pod: "gold", description: "Portfolio breakdown: invested amount, average buy price, net returns and value chart.", tags: ["gold", "portfolio", "breakdown", "screen"] },

  // Gold — Buy
  { title: "Buy Gold — First time", slug: "app-images", type: "image", pod: "gold", description: "First-time buy flow: enter amount in AED with quick-amount chips and gram conversion.", tags: ["gold", "buy", "amount-entry", "screen"] },
  { title: "Buy Gold — Confirming payment", slug: "app-images", type: "image", pod: "gold", description: "Payment confirmation state while the gold purchase is securely processed.", tags: ["gold", "buy", "payment", "confirmation", "screen"] },
  { title: "Buy Gold — Ownership certificate", slug: "app-images", type: "image", pod: "gold", description: "Certificate of gold ownership added to the user's vault (24K, 99.99% purity).", tags: ["gold", "buy", "certificate", "screen"] },

  // Gold — Sell
  { title: "Sell Gold — First time", slug: "app-images", type: "image", pod: "gold", description: "First-time sell flow: enter amount with quick-percentage chips and gram conversion.", tags: ["gold", "sell", "amount-entry", "screen"] },
  { title: "Sell Gold — Initiating sale", slug: "app-images", type: "image", pod: "gold", description: "Transition state while the gold sell is being initiated and funds are on the way.", tags: ["gold", "sell", "confirmation", "screen"] },
  { title: "Sell Gold — Sold successfully", slug: "app-images", type: "image", pod: "gold", description: "Sale success summary: gold sold, fees, net payout and payout timeline.", tags: ["gold", "sell", "success", "screen"] },

  // Gold — Leasing
  { title: "Gold Leasing — Landing page", slug: "app-images", type: "image", pod: "gold", description: "Leasing intro: earn an extra 3% per year by leasing your gold, with projected returns.", tags: ["gold", "leasing", "landing-page", "earn", "screen"] },
  { title: "Gold Leasing — Leased confirmation", slug: "app-images", type: "image", pod: "gold", description: "Confirmation that gold is now actively leased, with accrual, payout cadence and start date.", tags: ["gold", "leasing", "confirmation", "screen"] },
  { title: "Gold Leasing — Leased vault", slug: "app-images", type: "image", pod: "gold", description: "Vault view with active leased gold highlighted alongside invested value.", tags: ["gold", "leasing", "vault", "screen"] },
  { title: "Gold Leasing — Leased portfolio breakdown", slug: "app-images", type: "image", pod: "gold", description: "Leased portfolio breakdown: returns at 3% p.a., total earned and amount invested.", tags: ["gold", "leasing", "portfolio", "breakdown", "screen"] },
  { title: "Gold Leasing — Leased portfolio", slug: "app-images", type: "image", pod: "gold", description: "Active leased gold summary with total gold earned and next payout date.", tags: ["gold", "leasing", "portfolio", "screen"] },
  { title: "Gold Leasing — Monthly payout", slug: "app-images", type: "image", pod: "gold", description: "Monthly payout transaction detail: gram payout, period covered and payout breakdown.", tags: ["gold", "leasing", "payout", "screen"] },
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

  for (const a of [...sampleAssets, ...moreAssets, ...appScreens]) {
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
