import { Router } from "express";
import multer from "multer";
import { prisma } from "../db.js";
import { requireAdmin } from "../auth.js";
import * as storage from "../storage.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 300 * 1024 * 1024 }, // 300MB ceiling for screen recordings
});

function typeFromMime(mime, fallback) {
  if (!mime) return fallback || "graphic";
  if (mime === "image/gif") return "gif";
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime === "application/pdf") return "pdf";
  return fallback || "graphic";
}

function parseTags(raw) {
  if (!raw) return [];
  const arr = Array.isArray(raw) ? raw : String(raw).split(",");
  return [...new Set(arr.map((s) => s.trim().toLowerCase()).filter(Boolean))];
}

function tagConnect(names) {
  return names.map((name) => ({ where: { name }, create: { name } }));
}

function dto(a) {
  return {
    id: a.id,
    title: a.title,
    description: a.description,
    type: a.type,
    pod: a.pod,
    platform: a.platform,
    language: a.language,
    creatorType: a.creatorType,
    categoryId: a.categoryId,
    categorySlug: a.category?.slug,
    categoryName: a.category?.name,
    fileName: a.fileName,
    fileUrl: storage.publicUrl(a.fileKey),
    thumbUrl: a.thumbKey ? storage.publicUrl(a.thumbKey) : null,
    mimeType: a.mimeType,
    fileSize: a.fileSize,
    tags: a.tags.map((t) => t.name),
    createdAt: a.createdAt,
  };
}

const withRelations = { category: true, tags: true };

router.get("/", async (req, res) => {
  const assets = await prisma.asset.findMany({
    include: withRelations,
    orderBy: { createdAt: "desc" },
  });
  res.json(assets.map(dto));
});

router.post("/", requireAdmin, upload.single("file"), async (req, res) => {
  const b = req.body ?? {};
  if (!b.title?.trim()) return res.status(400).json({ error: "Title is required" });
  if (!b.categoryId) return res.status(400).json({ error: "Category is required" });
  const category = await prisma.category.findUnique({ where: { id: b.categoryId } });
  if (!category) return res.status(400).json({ error: "Category not found" });

  let fileFields = {};
  if (req.file) {
    const key = await storage.save(req.file.buffer, req.file.originalname, req.file.mimetype);
    fileFields = {
      fileKey: key,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
    };
  }

  const asset = await prisma.asset.create({
    data: {
      title: b.title.trim(),
      description: b.description?.trim() || null,
      type: typeFromMime(req.file?.mimetype, b.type),
      pod: b.pod || "general",
      platform: b.platform || "all",
      language: b.language || "en",
      creatorType: b.creatorType || "any",
      categoryId: b.categoryId,
      ...fileFields,
      tags: { connectOrCreate: tagConnect(parseTags(b.tags)) },
    },
    include: withRelations,
  });
  res.status(201).json(dto(asset));
});

router.patch("/:id", requireAdmin, upload.single("file"), async (req, res) => {
  const b = req.body ?? {};
  const existing = await prisma.asset.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ error: "Asset not found" });

  const data = {};
  if (b.title !== undefined) data.title = String(b.title).trim();
  if (b.description !== undefined) data.description = b.description?.trim() || null;
  if (b.pod !== undefined) data.pod = b.pod;
  if (b.platform !== undefined) data.platform = b.platform;
  if (b.language !== undefined) data.language = b.language;
  if (b.creatorType !== undefined) data.creatorType = b.creatorType;
  if (b.categoryId !== undefined) data.categoryId = b.categoryId;
  if (b.type !== undefined) data.type = b.type;
  if (b.tags !== undefined)
    data.tags = { set: [], connectOrCreate: tagConnect(parseTags(b.tags)) };

  if (req.file) {
    await storage.remove(existing.fileKey);
    const key = await storage.save(req.file.buffer, req.file.originalname, req.file.mimetype);
    data.fileKey = key;
    data.fileName = req.file.originalname;
    data.mimeType = req.file.mimetype;
    data.fileSize = req.file.size;
    data.type = typeFromMime(req.file.mimetype, b.type || existing.type);
  }

  const asset = await prisma.asset.update({
    where: { id: req.params.id },
    data,
    include: withRelations,
  });
  res.json(dto(asset));
});

router.delete("/:id", requireAdmin, async (req, res) => {
  const existing = await prisma.asset.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ error: "Asset not found" });
  await storage.remove(existing.fileKey);
  await prisma.asset.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

export default router;
