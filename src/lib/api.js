// Thin fetch wrapper. Uses relative /api (Vite proxies to the Express server).
const base = "/api";

async function req(path, options = {}) {
  const res = await fetch(base + path, { credentials: "include", ...options });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) msg = body.error;
    } catch {
      /* non-json */
    }
    throw new Error(msg);
  }
  return res.status === 204 ? null : res.json();
}

const json = (method, body) => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const api = {
  // public
  getCategories: () => req("/categories"),
  getAssets: () => req("/assets"),
  createRequest: (data) => req("/requests", json("POST", data)),

  // creative requests (admin)
  getRequests: () => req("/requests"),
  updateRequest: (id, status) => req(`/requests/${id}`, json("PATCH", { status })),
  deleteRequest: (id) => req(`/requests/${id}`, { method: "DELETE" }),

  // auth
  login: (email, password) => req("/auth/login", json("POST", { email, password })),
  logout: () => req("/auth/logout", { method: "POST" }),
  me: () => req("/auth/me"),

  // categories (admin)
  createCategory: (data) => req("/categories", json("POST", data)),
  updateCategory: (id, data) => req(`/categories/${id}`, json("PATCH", data)),
  deleteCategory: (id) => req(`/categories/${id}`, { method: "DELETE" }),

  // assets (admin) — FormData for multipart upload
  createAsset: (formData) => req("/assets", { method: "POST", body: formData }),
  updateAsset: (id, formData) => req(`/assets/${id}`, { method: "PATCH", body: formData }),
  deleteAsset: (id) => req(`/assets/${id}`, { method: "DELETE" }),
};
