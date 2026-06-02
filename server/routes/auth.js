import { Router } from "express";
import { prisma } from "../db.js";
import { COOKIE, sign, verify, verifyPassword, publicUser } from "../auth.js";

const router = Router();

const cookieOpts = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  path: "/",
};

router.post("/login", async (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = req.body?.password || "";
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  const user = await prisma.user.findUnique({ where: { email } });
  // Same message either way so we don't leak which emails exist.
  if (!user || !verifyPassword(password, user.passwordHash))
    return res.status(401).json({ error: "Incorrect email or password" });

  res.cookie(COOKIE, sign(user.id), cookieOpts);
  res.json({ user: publicUser(user) });
});

router.post("/logout", (req, res) => {
  res.clearCookie(COOKIE, { path: "/" });
  res.json({ ok: true });
});

router.get("/me", async (req, res) => {
  const userId = verify(req.cookies?.[COOKIE]);
  if (!userId) return res.json({ user: null });
  const user = await prisma.user.findUnique({ where: { id: userId } });
  res.json({ user: publicUser(user) });
});

export default router;
