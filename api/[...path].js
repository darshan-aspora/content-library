// Vercel serverless entry. This single-bracket catch-all (api/[...path].js)
// handles every /api/* request — including nested paths like /api/auth/login —
// and preserves the full original path, so the Express app below can route
// exactly as it does locally. (Double-bracket [[...path]] is Next.js-only and
// Vercel's generic filesystem router only matched single-segment paths.)
import app from "../server/app.js";

export default app;
