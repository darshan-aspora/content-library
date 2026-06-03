// Vercel serverless entry. vercel.json routes every /api/* request (at any
// depth) to this function via `routes`, which preserves the full original path,
// so the Express app below routes /api/auth/login, /api/assets, etc. exactly as
// it does locally. (Zero-config filesystem catch-all only matched single-segment
// /api/* paths, so nested routes like /api/auth/login 404'd.)
import app from "../server/app.js";

export default app;
