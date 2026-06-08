// Auto-attach the brand-kit files to their library records: reads each file
// from the extracted Logo folder, uploads it to storage (Supabase in prod), and
// sets fileKey/fileName/mimeType/fileSize/type on the matching asset — the same
// fields the admin uploader writes.
//
// Safe by default: prints the plan and exits. Pass --apply to upload.
//   node --env-file=.env prisma/upload-brand.js                       # dry run
//   node --env-file=.env prisma/upload-brand.js --apply               # execute
//   node --env-file=.env prisma/upload-brand.js --dir=/path --apply   # custom dir
import { PrismaClient } from "@prisma/client";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { brandAssets } from "./data/brand-assets.js";
import * as storage from "../server/storage.js";

const prisma = new PrismaClient();
const APPLY = process.argv.includes("--apply");
const FORCE = process.argv.includes("--force");
const dirArg = process.argv.find((a) => a.startsWith("--dir="));
const BASE = dirArg ? dirArg.split("=")[1] : "/tmp/aspora-logos/Logo";

const MIME = { ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg" };
const typeFromMime = (m) => (m === "image/gif" ? "gif" : m.startsWith("image/") ? "image" : m.startsWith("video/") ? "video" : m === "application/pdf" ? "pdf" : "graphic");

async function main() {
  console.log(`\nSource dir: ${BASE}\nStorage backend: ${storage.usingSupabase ? "Supabase" : "local disk"}\n`);

  let planned = 0, missingFile = 0, missingRec = 0, skipped = 0;
  const work = [];
  for (const a of brandAssets) {
    const abs = path.join(BASE, a.sourceFile);
    if (!existsSync(abs)) { console.log(`  ✗ file missing: ${a.sourceFile}`); missingFile++; continue; }
    const rec = await prisma.asset.findFirst({ where: { title: a.title } });
    if (!rec) { console.log(`  ✗ record missing: ${a.title}`); missingRec++; continue; }
    if (rec.fileKey && !FORCE) { skipped++; continue; }
    work.push({ rec, abs, fileName: path.basename(a.sourceFile) });
    planned++;
  }

  console.log(`\nPlan: upload ${planned}, skip ${skipped} (already have a file), missing files ${missingFile}, missing records ${missingRec}.`);
  if (!APPLY) { console.log("\nDry run — nothing uploaded. Re-run with --apply.\n"); return; }

  let done = 0;
  for (const w of work) {
    const ext = path.extname(w.fileName).toLowerCase();
    const mime = MIME[ext] || "application/octet-stream";
    const buf = await readFile(w.abs);
    if (w.rec.fileKey) await storage.remove(w.rec.fileKey); // FORCE re-upload path
    const key = await storage.save(buf, w.fileName, mime);
    await prisma.asset.update({
      where: { id: w.rec.id },
      data: { fileKey: key, fileName: w.fileName, mimeType: mime, fileSize: buf.length, type: typeFromMime(mime) },
    });
    done++;
    console.log(`  ✓ ${w.rec.title}`);
  }
  console.log(`\nApplied. Uploaded & attached ${done} files.\n`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
