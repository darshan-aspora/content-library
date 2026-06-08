// Backfill Asset.section for existing rows by re-deriving it from each asset's
// pod + tags + title (prisma/data/sections.js). Idempotent: re-running just
// re-computes the same values. Use after `prisma db push` adds the column.
//
// Safe by default: prints the plan and exits. Pass --apply to write.
//   node --env-file=.env prisma/set-sections.js            # dry run
//   node --env-file=.env prisma/set-sections.js --apply    # execute
import { PrismaClient } from "@prisma/client";
import { sectionFor, sectionsByPod } from "./data/sections.js";

const prisma = new PrismaClient();
const APPLY = process.argv.includes("--apply");

const labelOf = (pod, id) =>
  sectionsByPod[pod]?.find((s) => s.id === id)?.label ?? id;

async function main() {
  const assets = await prisma.asset.findMany({
    include: { tags: true },
    orderBy: { createdAt: "asc" },
  });

  const updates = [];
  const counts = {};
  for (const a of assets) {
    const next = sectionFor({ pod: a.pod, tags: a.tags.map((t) => t.name), title: a.title, type: a.type });
    if (next !== a.section) updates.push({ id: a.id, title: a.title, pod: a.pod, from: a.section, to: next });
    const key = `${a.pod} / ${next || "(none)"}`;
    counts[key] = (counts[key] || 0) + 1;
  }

  console.log(`\nScanned ${assets.length} assets. ${updates.length} need a section change.\n`);
  console.log("Resulting distribution:");
  for (const key of Object.keys(counts).sort()) console.log(`  ${key}: ${counts[key]}`);

  if (updates.length) {
    console.log("\nChanges:");
    for (const u of updates) console.log(`  • [${u.pod}] ${u.title}: "${u.from || "—"}" → "${u.to || "—"}" (${labelOf(u.pod, u.to)})`);
  }

  if (!APPLY) {
    console.log("\nDry run — nothing changed. Re-run with --apply to execute.\n");
    return;
  }

  for (const u of updates) {
    await prisma.asset.update({ where: { id: u.id }, data: { section: u.to } });
  }
  console.log(`\nApplied. Updated ${updates.length} assets.\n`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
