// Express app factory, shared by local dev (server/index.js) and the Vercel
// serverless function (api/index.js). No app.listen() and no filesystem writes
// at import time — the serverless filesystem is read-only.

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { UPLOADS_DIR, usingSupabase } from "./storage.js";
import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/categories.js";
import assetRoutes from "./routes/assets.js";
import requestRoutes from "./routes/requests.js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Local/dev only: serve uploaded files from disk. In production, files live in
// Supabase Storage and are served directly from its public URLs.
if (!usingSupabase) {
  app.use("/uploads", express.static(UPLOADS_DIR, { maxAge: "1h" }));
}

app.get("/api/health", (req, res) => res.json({ ok: true, build: "routes-v1" }));
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/requests", requestRoutes);

// JSON error fallback (e.g. multer file-size limit)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

export default app;
