// Vercel serverless entry. This catch-all file (api/[[...path]].js) handles every
// /api/* request and preserves the full original path, so the Express app below
// can route /api/auth/login, /api/assets, etc. exactly as it does locally.
import app from "../server/app.js";

export default app;
