// Vercel serverless entry. All /api/* requests are rewritten to this function
// (see vercel.json); the Express app handles routing from there.
import app from "../server/app.js";

export default app;
