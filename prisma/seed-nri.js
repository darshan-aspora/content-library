// Create the NRI Banking app-screen records (prisma/data/nri-screens.js) under
// pod "nri", grouped into the sub-flow sections drawn on the Figma boards.
// Records are metadata-only — attach the screenshot to each via the admin Edit
// form (or your upload script) once the DB is pushed.
//
// Safe by default: prints what it would create and exits. Pass --apply to write.
//   node --env-file=.env prisma/seed-nri.js            # dry run
//   node --env-file=.env prisma/seed-nri.js --apply    # execute
import { PrismaClient } from "@prisma/client";
import { nriScreens } from "./data/nri-screens.js";
import { sectionsByPod } from "./data/sections.js";

const prisma = new PrismaClient();
const APPLY = process.argv.includes("--apply");

const labelOf = (id) => sectionsByPod.nri.find((s) => s.id === id)?.label ?? id;

async function main() {
  const cat = await prisma.category.findUnique({ where: { slug: "app-images" } });
  if (!cat) throw new Error('Category "app-images" not found. Run the main seed first.');

  // Group the plan by section for a readable preview.
  const bySection = {};
  for (const a of nriScreens) (bySection[a.section] ??= []).push(a.title);

  console.log(`\nNRI screens to CREATE (${nriScreens.length}) under "App Images" (pod: nri):`);
  for (const s of sectionsByPod.nri) {
    const items = bySection[s.id] || [];
    if (!items.length) continue;
    console.log(`\n  ${labelOf(s.id)} (${items.length}):`);
    for (const t of items) console.log(`    + ${t}`);
  }

  const already = await prisma.asset.count({ where: { title: { in: nriScreens.map((a) => a.title) } } });
  if (already) console.log(`\n  note: ${already} of these titles already exist and will be skipped.`);

  if (!APPLY) {
    console.log("\nDry run — nothing changed. Re-run with --apply to execute.\n");
    return;
  }

  let created = 0;
  for (const a of nriScreens) {
    const exists = await prisma.asset.findFirst({ where: { title: a.title } });
    if (exists) continue;
    await prisma.asset.create({
      data: {
        title: a.title,
        description: a.description,
        type: a.type,
        pod: a.pod,
        section: a.section,
        platform: a.platform,
        creatorType: a.creatorType,
        categoryId: cat.id,
        tags: { connectOrCreate: a.tags.map((name) => ({ where: { name }, create: { name } })) },
      },
    });
    created++;
  }
  console.log(`\nApplied. Created ${created} NRI screens.\n`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
