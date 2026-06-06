// Delete every asset in one or more pods. Safe by default: prints what it would
// remove and exits. Pass --apply to execute. Pods default to general,nri but can
// be overridden with --pods=general,nri.
//
//   node --env-file=.env prisma/clear-pods.js                 # dry run (general,nri)
//   node --env-file=.env prisma/clear-pods.js --apply         # execute
//   node --env-file=.env prisma/clear-pods.js --pods=nri --apply
import { PrismaClient } from "@prisma/client";
import * as storage from "../server/storage.js";

const prisma = new PrismaClient();
const APPLY = process.argv.includes("--apply");
const podsArg = process.argv.find((a) => a.startsWith("--pods="));
const pods = (podsArg ? podsArg.split("=")[1] : "general,nri")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

async function main() {
  const existing = await prisma.asset.findMany({
    where: { pod: { in: pods } },
    select: { id: true, title: true, type: true, pod: true, fileKey: true },
    orderBy: [{ pod: "asc" }, { title: "asc" }],
  });
  const withMedia = existing.filter((a) => a.fileKey);

  console.log(`\nPods to clear: ${pods.join(", ")}`);
  console.log(`Assets to DELETE (${existing.length}):`);
  for (const a of existing) {
    console.log(`  - [${a.pod}/${a.type}] ${a.title}${a.fileKey ? `  (media: ${a.fileKey})` : ""}`);
  }
  if (withMedia.length) {
    console.log(`\n  ⚠ ${withMedia.length} have uploaded media that will also be removed from storage.`);
  }

  if (!APPLY) {
    console.log("\nDry run — nothing changed. Re-run with --apply to execute.\n");
    return;
  }

  for (const a of withMedia) {
    try {
      await storage.remove(a.fileKey);
    } catch (e) {
      console.warn(`  ! could not remove media ${a.fileKey}: ${e.message}`);
    }
  }
  const del = await prisma.asset.deleteMany({ where: { pod: { in: pods } } });
  console.log(`\nApplied. Deleted ${del.count} assets across pods: ${pods.join(", ")}.\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
