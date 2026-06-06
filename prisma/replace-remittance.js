// One-off content migration: replace ALL pod="remittance" assets with the new
// remittance app-screen list (prisma/data/remittance-screens.js).
//
// Safe by default: prints what it WOULD delete/create and exits. Pass --apply
// to actually delete the old remittance assets (and their uploaded media, if
// any) and create the new ones.
//
//   node --env-file=.env prisma/replace-remittance.js           # dry run
//   node --env-file=.env prisma/replace-remittance.js --apply   # execute
import { PrismaClient } from "@prisma/client";
import { remittanceScreens } from "./data/remittance-screens.js";
import * as storage from "../server/storage.js";

const prisma = new PrismaClient();
const APPLY = process.argv.includes("--apply");

async function main() {
  const cat = await prisma.category.findUnique({ where: { slug: "app-images" } });
  if (!cat) {
    throw new Error('Category "app-images" not found. Run the main seed first.');
  }

  const existing = await prisma.asset.findMany({
    where: { pod: "remittance" },
    select: { id: true, title: true, type: true, fileKey: true },
    orderBy: { title: "asc" },
  });

  const withMedia = existing.filter((a) => a.fileKey);

  console.log(`\nCurrent pod="remittance" assets to DELETE (${existing.length}):`);
  for (const a of existing) {
    console.log(`  - [${a.type}] ${a.title}${a.fileKey ? `  (media: ${a.fileKey})` : ""}`);
  }
  if (withMedia.length) {
    console.log(`\n  ⚠ ${withMedia.length} of these have uploaded media that will also be removed from storage.`);
  }

  console.log(`\nNew remittance list to CREATE (${remittanceScreens.length}) under "${cat.name}":`);
  for (const a of remittanceScreens) console.log(`  + [${a.type}] ${a.title}`);

  if (!APPLY) {
    console.log("\nDry run — nothing changed. Re-run with --apply to execute.\n");
    return;
  }

  // Remove uploaded media first (best-effort), then the rows.
  for (const a of withMedia) {
    try {
      await storage.remove(a.fileKey);
    } catch (e) {
      console.warn(`  ! could not remove media ${a.fileKey}: ${e.message}`);
    }
  }
  const del = await prisma.asset.deleteMany({ where: { pod: "remittance" } });

  let created = 0;
  for (const a of remittanceScreens) {
    await prisma.asset.create({
      data: {
        title: a.title,
        description: a.description,
        type: a.type,
        pod: a.pod ?? "remittance",
        platform: a.platform ?? "all",
        language: a.language ?? "en",
        creatorType: a.creatorType ?? "any",
        categoryId: cat.id,
        tags: {
          connectOrCreate: a.tags.map((name) => ({ where: { name }, create: { name } })),
        },
      },
    });
    created++;
  }

  console.log(`\nApplied. Deleted ${del.count} old remittance assets, created ${created} new ones.\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
