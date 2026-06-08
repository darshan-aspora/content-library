// Create the Aspora brand-kit library items (prisma/data/brand-assets.js) under
// pod "general". Ensures the "Logos & Brand Kit" category exists first. Records
// are metadata-only — attach the matching file (see each record's sourceFile)
// via the admin Edit form, or run prisma/upload-brand.js to auto-attach.
//
// Safe by default: prints what it would create and exits. Pass --apply to write.
//   node --env-file=.env prisma/seed-brand.js            # dry run
//   node --env-file=.env prisma/seed-brand.js --apply    # execute
import { PrismaClient } from "@prisma/client";
import { brandAssets } from "./data/brand-assets.js";

const prisma = new PrismaClient();
const APPLY = process.argv.includes("--apply");

async function main() {
  const graphics = await prisma.category.findUnique({ where: { slug: "graphics" } });
  if (!graphics) throw new Error('Pillar "graphics" not found. Run the main seed first.');

  console.log(`\nBrand-kit items to CREATE (${brandAssets.length}) under "Logos & Brand Kit" (pod: general):`);
  for (const a of brandAssets) console.log(`  + ${a.title}`);

  const already = await prisma.asset.count({ where: { title: { in: brandAssets.map((a) => a.title) } } });
  if (already) console.log(`\n  note: ${already} of these titles already exist and will be skipped.`);

  if (!APPLY) {
    console.log("\nDry run — nothing changed. Re-run with --apply to execute.\n");
    return;
  }

  const cat = await prisma.category.upsert({
    where: { slug: "brand-logos" },
    update: { name: "Logos & Brand Kit", note: "Aspora logos, logomarks and icons in every colour & format", parentId: graphics.id },
    create: { name: "Logos & Brand Kit", slug: "brand-logos", note: "Aspora logos, logomarks and icons in every colour & format", parentId: graphics.id, order: 5 },
  });

  let created = 0;
  for (const a of brandAssets) {
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
        categoryId: cat.id,
        tags: { connectOrCreate: a.tags.map((name) => ({ where: { name }, create: { name } })) },
      },
    });
    created++;
  }
  console.log(`\nApplied. Created ${created} brand-kit assets.\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
