// Storage abstraction. Today: local disk under ./uploads.
// Swap this module's impl for S3/Cloudinary later without touching routes —
// keep the same { save, remove, publicUrl } contract.

import { mkdir, writeFile, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const UPLOADS_DIR = path.join(__dirname, "..", "uploads");

function safeExt(originalName = "") {
  const ext = path.extname(originalName).toLowerCase();
  return /^\.[a-z0-9]{1,8}$/.test(ext) ? ext : "";
}

// Persist a buffer; returns a storage key (relative path) used as fileKey.
export async function save(buffer, originalName) {
  if (!existsSync(UPLOADS_DIR)) await mkdir(UPLOADS_DIR, { recursive: true });
  const key = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${safeExt(originalName)}`;
  await writeFile(path.join(UPLOADS_DIR, key), buffer);
  return key;
}

export async function remove(key) {
  if (!key) return;
  const target = path.join(UPLOADS_DIR, key);
  // Guard against path traversal — key must resolve inside UPLOADS_DIR.
  if (!target.startsWith(UPLOADS_DIR)) return;
  try {
    await unlink(target);
  } catch {
    /* already gone */
  }
}

// Public URL the frontend can use (served statically by Express / Vite proxy).
export function publicUrl(key) {
  return key ? `/uploads/${key}` : null;
}
