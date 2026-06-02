import { Router } from "express";
import { prisma } from "../db.js";
import { requireAdmin } from "../auth.js";

const router = Router();

function slugify(name) {
  return (
    String(name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "category"
  );
}

async function uniqueSlug(base) {
  let slug = base;
  let i = 1;
  while (await prisma.category.findUnique({ where: { slug } })) {
    slug = `${base}-${i++}`;
  }
  return slug;
}

// Public: flat, ordered list. Frontend builds the tree + computes counts.
router.get("/", async (req, res) => {
  const cats = await prisma.category.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
    select: { id: true, code: true, name: true, slug: true, note: true, parentId: true, order: true },
  });
  res.json(cats);
});

router.post("/", requireAdmin, async (req, res) => {
  const { name, parentId, note, code } = req.body ?? {};
  if (!name?.trim()) return res.status(400).json({ error: "Name is required" });
  if (parentId) {
    const parent = await prisma.category.findUnique({ where: { id: parentId } });
    if (!parent) return res.status(400).json({ error: "Parent not found" });
    if (parent.parentId) return res.status(400).json({ error: "Only two levels are supported" });
  }
  const order = await prisma.category.count({ where: { parentId: parentId ?? null } });
  const created = await prisma.category.create({
    data: {
      name: name.trim(),
      slug: await uniqueSlug(slugify(name)),
      note: note?.trim() || null,
      code: code?.trim() || null,
      parentId: parentId || null,
      order,
    },
  });
  res.status(201).json(created);
});

router.patch("/:id", requireAdmin, async (req, res) => {
  const { name, note, code, order } = req.body ?? {};
  const data = {};
  if (name !== undefined) data.name = String(name).trim();
  if (note !== undefined) data.note = note?.trim() || null;
  if (code !== undefined) data.code = code?.trim() || null;
  if (order !== undefined) data.order = Number(order) || 0;
  try {
    const updated = await prisma.category.update({ where: { id: req.params.id }, data });
    res.json(updated);
  } catch {
    res.status(404).json({ error: "Category not found" });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  const id = req.params.id;
  const childCount = await prisma.category.count({ where: { parentId: id } });
  if (childCount > 0)
    return res.status(409).json({ error: "Remove or move subfolders first" });
  const assetCount = await prisma.asset.count({ where: { categoryId: id } });
  if (assetCount > 0)
    return res.status(409).json({ error: "Move or delete its assets first" });
  try {
    await prisma.category.delete({ where: { id } });
    res.json({ ok: true });
  } catch {
    res.status(404).json({ error: "Category not found" });
  }
});

export default router;
