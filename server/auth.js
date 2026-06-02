import crypto from "node:crypto";
import { prisma } from "./db.js";

const SECRET = process.env.SESSION_SECRET || "dev-secret";
export const COOKIE = "asl_session";

function hmac(value) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

// --- Signed session token (carries the user id) ---
export function sign(value) {
  return `${value}.${hmac(value)}`;
}

export function verify(token) {
  if (!token || !token.includes(".")) return null;
  const idx = token.lastIndexOf(".");
  const value = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  const expected = hmac(value);
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  return value; // the user id
}

// --- Password hashing (scrypt, no extra deps) ---
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  const [salt, hash] = String(stored || "").split(":");
  if (!salt || !hash) return false;
  const test = crypto.scryptSync(String(password), salt, 64);
  const orig = Buffer.from(hash, "hex");
  return orig.length === test.length && crypto.timingSafeEqual(orig, test);
}

export const publicUser = (u) =>
  u ? { id: u.id, name: u.name, email: u.email, role: u.role } : null;

// --- Middleware ---
export async function requireAuth(req, res, next) {
  const userId = verify(req.cookies?.[COOKIE]);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  req.user = user;
  next();
}

export function requireAdmin(req, res, next) {
  return requireAuth(req, res, () => {
    if (req.user.role !== "superadmin")
      return res.status(403).json({ error: "Admin access required" });
    next();
  });
}
