// Local development entry point. Starts a long-lived HTTP server.
// On Vercel the app is served by api/index.js as a serverless function instead.
import app from "./app.js";

// Dedicated var so an externally-injected PORT (e.g. a dev harness) can't collide
// with the Vite dev server. Vite proxies /api and /uploads to this port.
const PORT = process.env.API_PORT || 3001;

app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
