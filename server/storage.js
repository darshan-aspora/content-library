// Storage abstraction with two backends behind one { save, remove, publicUrl }
// contract:
//   • Supabase Storage  — used when SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are
//     set (production on Vercel). Files persist and are served from public URLs.
//   • Local disk         — fallback for local dev so no Supabase setup is needed.

import { mkdir, writeFile, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const UPLOADS_DIR = path.join(__dirname, "..", "uploads");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.SUPABASE_BUCKET || "assets";

export const usingSupabase = Boolean(SUPABASE_URL && SUPABASE_KEY);

function safeExt(originalName = "") {
  const ext = path.extname(originalName).toLowerCase();
  return /^\.[a-z0-9]{1,8}$/.test(ext) ? ext : "";
}

function newKey(originalName) {
  return `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${safeExt(originalName)}`;
}

// --- Supabase Storage backend ---------------------------------------------
let _client;
async function supabase() {
  if (!_client) {
    const { createClient } = await import("@supabase/supabase-js");
    _client = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false },
    });
  }
  return _client;
}

// --- Public API ------------------------------------------------------------

// Persist a buffer; returns a storage key used as fileKey on the Asset.
export async function save(buffer, originalName, contentType) {
  const key = newKey(originalName);

  if (usingSupabase) {
    const client = await supabase();
    const { error } = await client.storage
      .from(BUCKET)
      .upload(key, buffer, {
        contentType: contentType || "application/octet-stream",
        upsert: false,
      });
    if (error) throw new Error(`Upload failed: ${error.message}`);
    return key;
  }

  if (!existsSync(UPLOADS_DIR)) await mkdir(UPLOADS_DIR, { recursive: true });
  await writeFile(path.join(UPLOADS_DIR, key), buffer);
  return key;
}

export async function remove(key) {
  if (!key) return;

  if (usingSupabase) {
    const client = await supabase();
    await client.storage.from(BUCKET).remove([key]);
    return;
  }

  const target = path.join(UPLOADS_DIR, key);
  // Guard against path traversal — key must resolve inside UPLOADS_DIR.
  if (!target.startsWith(UPLOADS_DIR)) return;
  try {
    await unlink(target);
  } catch {
    /* already gone */
  }
}

// Public URL the frontend can use to load the file.
export function publicUrl(key) {
  if (!key) return null;
  if (usingSupabase) {
    return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${key}`;
  }
  return `/uploads/${key}`;
}
