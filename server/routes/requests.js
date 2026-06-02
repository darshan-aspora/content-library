import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth, requireAdmin } from "../auth.js";

const router = Router();

const PODS = ["general", "remittance", "gold", "nri"];
const PLATFORMS = ["all", "instagram", "x", "youtube"];
const STATUSES = ["new", "in-progress", "done"];

// Any logged-in user submits a creative request. The requester's name/email
// come from their session — not the form.
router.post("/", requireAuth, async (req, res) => {
  const { title, description, pod, platform } = req.body ?? {};
  if (!title?.trim()) return res.status(400).json({ error: "Please describe what you need" });

  const created = await prisma.creativeRequest.create({
    data: {
      title: title.trim().slice(0, 200),
      description: description?.trim()?.slice(0, 2000) || null,
      pod: PODS.includes(pod) ? pod : "general",
      platform: PLATFORMS.includes(platform) ? platform : "all",
      requesterName: req.user.name,
      requesterEmail: req.user.email,
    },
  });
  res.status(201).json({ id: created.id, ok: true });
});

// Admin: list all requests, newest first.
router.get("/", requireAdmin, async (req, res) => {
  const requests = await prisma.creativeRequest.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(requests);
});

// Admin: update status.
router.patch("/:id", requireAdmin, async (req, res) => {
  const { status } = req.body ?? {};
  if (!STATUSES.includes(status))
    return res.status(400).json({ error: "Invalid status" });
  try {
    const updated = await prisma.creativeRequest.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json(updated);
  } catch {
    res.status(404).json({ error: "Request not found" });
  }
});

// Admin: delete a request.
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await prisma.creativeRequest.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch {
    res.status(404).json({ error: "Request not found" });
  }
});

export default router;
