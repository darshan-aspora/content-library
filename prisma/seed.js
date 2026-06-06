import { PrismaClient } from "@prisma/client";
import crypto from "node:crypto";
import { remittanceScreens } from "./data/remittance-screens.js";

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

// Gold authored content (scripts + templates). The `general` and `nri` pods are
// intentionally left empty: `general` will be repopulated with brand assets
// (logos/icons) and `nri` stays blank until those screens are ready. The header
// tabs still render for empty pods, so both stay visible in the library.
const goldExtras = [
  { title: "Wedding savings narrative", slug: "script-nonfinance", type: "script", pod: "gold", creatorType: "non-finance", description: "Saving in gold for a wedding — emotional, aspirational framing.", tags: ["wedding", "gold", "savings"] },
  { title: "Compounding explained with chai", slug: "script-finance", type: "script", pod: "gold", creatorType: "finance", description: "Everyday analogy script for compounding returns.", tags: ["compounding", "explainer", "analogy"] },
  { title: "SIP vs digital gold comparison", slug: "script-finance", type: "script", pod: "gold", creatorType: "finance", description: "Side-by-side logic for recurring gold vs mutual-fund SIP.", tags: ["sip", "gold", "comparison"] },
  { title: "Canva post — gold milestone", slug: "gfx-templates", type: "template", pod: "gold", platform: "instagram", creatorType: "any", description: "Square post celebrating a gold savings milestone.", tags: ["canva", "post", "gold"] },
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

  for (const a of [...goldExtras, ...appScreens, ...remittanceScreens]) {
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
