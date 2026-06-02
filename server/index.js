import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { existsSync, mkdirSync } from "node:fs";

import { UPLOADS_DIR } from "./storage.js";
import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/categories.js";
import assetRoutes from "./routes/assets.js";
import requestRoutes from "./routes/requests.js";

if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true });

const app = express();
// Dedicated var so an externally-injected PORT (e.g. a dev harness) can't collide
// with the Vite dev server. Vite proxies /api and /uploads to this port.
const PORT = process.env.API_PORT || 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(UPLOADS_DIR, { maxAge: "1h" }));

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/requests", requestRoutes);

// JSON error fallback (e.g. multer file-size limit)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
