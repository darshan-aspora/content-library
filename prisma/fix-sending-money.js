// One-off correction: the NRI send-money screens were first created under the
// "Adding Money" section with "Move money —" titles. The board labels them as
// their own "Sending Money" flow. This renames + re-sections those 7 records
// in place (matching the now-updated prisma/data/nri-screens.js), so no
// duplicates are created and attached files (if any) are preserved.
//
// Safe by default: prints the plan and exits. Pass --apply to write.
//   node --env-file=.env prisma/fix-sending-money.js            # dry run
//   node --env-file=.env prisma/fix-sending-money.js --apply    # execute
import { PrismaClient } from "@prisma/client";
import { nriScreens } from "./data/nri-screens.js";

const prisma = new PrismaClient();
const APPLY = process.argv.includes("--apply");

// old title (as created earlier) → new title (current data file)
const RENAME = {
  "Move money — Amount entry": "Sending money — Amount entry",
  "Move money — Review transfer": "Sending money — Review & confirm transfer",
  "Move money — Transfer success": "Sending money — Transfer success",
  "Move money — Confirming at gateway": "Sending money — Confirming at gateway",
  "Move money — Enter MPIN": "Sending money — Enter MPIN",
  "Move money — MPIN verified": "Sending money — MPIN verified",
  "Move money — Funds transferred": "Sending money — Funds transferred",
};

const byTitle = Object.fromEntries(nriScreens.map((a) => [a.title, a]));

async function main() {
  const plan = [];
  for (const [oldTitle, newTitle] of Object.entries(RENAME)) {
    const rec = await prisma.asset.findFirst({ where: { title: oldTitle } });
    const data = byTitle[newTitle];
    if (!data) { console.log(`  ! no data-file entry for "${newTitle}" — skipping`); continue; }
    if (!rec) {
      // Already renamed, or never existed under the old title.
      const already = await prisma.asset.findFirst({ where: { title: newTitle } });
      console.log(`  · "${oldTitle}" not found ${already ? "(already renamed)" : "(missing)"}`);
      continue;
    }
    plan.push({ id: rec.id, oldTitle, newTitle, data });
  }

  console.log(`\nRecords to update (${plan.length}): "Adding Money" → "Sending Money"`);
  for (const p of plan) console.log(`  • "${p.oldTitle}"  →  "${p.newTitle}"  [section: sending-money]`);

  if (!APPLY) { console.log("\nDry run — nothing changed. Re-run with --apply.\n"); return; }

  for (const p of plan) {
    await prisma.asset.update({
      where: { id: p.id },
      data: {
        title: p.newTitle,
        section: p.data.section,
        description: p.data.description,
        tags: { set: [], connectOrCreate: p.data.tags.map((name) => ({ where: { name }, create: { name } })) },
      },
    });
    console.log(`  ✓ ${p.newTitle}`);
  }
  console.log(`\nApplied. Updated ${plan.length} records.\n`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
