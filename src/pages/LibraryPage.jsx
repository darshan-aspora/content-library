import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { PRODUCTS, productMeta } from "../lib/meta";
import FilterMenu from "../components/FilterMenu";
import Logo from "../components/Logo";
import AssetCard from "../components/AssetCard";
import PreviewModal from "../components/PreviewModal";
import RequestModal from "../components/RequestModal";

// Secondary facets (Product/pod is the header tabs).
const BAR_FACETS = ["type", "platform", "creatorType", "language"];

export default function LibraryPage() {
  const { user, isAdmin, logout } = useAuth();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [product, setProduct] = useState("all"); // pod tab
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState({});
  const [preview, setPreview] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestPrefill, setRequestPrefill] = useState("");

  const openRequest = (prefill = "") => {
    setRequestPrefill(prefill);
    setRequestOpen(true);
  };

  useEffect(() => {
    api
      .getAssets()
      .then(setAssets)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Compact the header once the page scrolls (Mobbin scroll state).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggle = (facet, value) =>
    setSelected((prev) => {
      const next = { ...prev };
      const set = new Set(next[facet] ?? []);
      set.has(value) ? set.delete(value) : set.add(value);
      next[facet] = set;
      return next;
    });

  const clearFilters = () => setSelected({});

  const q = query.trim().toLowerCase();

  const inProduct = (a) => product === "all" || a.pod === product;
  const passesFilters = (a) => {
    for (const f of BAR_FACETS) {
      const set = selected[f];
      if (set && set.size > 0 && !set.has(a[f])) return false;
    }
    if (q) {
      const hay = [a.title, a.description, a.categoryName, ...(a.tags || [])].join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  };

  const visible = useMemo(
    () => assets.filter((a) => inProduct(a) && passesFilters(a)),
    [assets, product, q, selected]
  );

  const productCount = (pid) => assets.filter((a) => pid === "all" || a.pod === pid).length;

  // Lightbox navigation within the visible grid.
  const previewIndex = preview ? visible.findIndex((a) => a.id === preview.id) : -1;
  const goPrev = previewIndex > 0 ? () => setPreview(visible[previewIndex - 1]) : null;
  const goNext = previewIndex >= 0 && previewIndex < visible.length - 1 ? () => setPreview(visible[previewIndex + 1]) : null;

  const activeFilterCount =
    Object.values(selected).reduce((acc, s) => acc + (s?.size ?? 0), 0) + (q ? 1 : 0);

  return (
    <div className="min-h-full bg-white">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur">
        {/* Row 1: brand (left) · search + request (centered group) · account (right) */}
        <div className={`mx-auto flex w-full max-w-[1400px] items-center gap-4 px-5 transition-all sm:px-8 ${scrolled ? "py-2" : "py-3"}`}>
          {/* Left zone */}
          <div className="flex min-w-0 flex-1 items-center">
            <Link to="/" className="flex items-center gap-2.5" onClick={() => setProduct("all")}>
              <Logo className="h-6" />
              <span className="hidden h-5 w-px bg-slate-200 sm:block" />
              <span className="hidden text-sm font-semibold text-slate-700 sm:block">Content Library</span>
            </Link>
          </div>

          {/* Center group: search + request */}
          <div className="flex shrink-0 items-center gap-3">
            <div className="relative w-44 sm:w-[24rem]">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search assets, tags…"
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-9 text-sm outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              )}
            </div>
            <button
              onClick={() => openRequest("")}
              className="shrink-0 rounded-full bg-brand px-3.5 py-2 text-[13px] font-semibold text-white transition hover:bg-brand/90"
            >
              Request
            </button>
          </div>

          {/* Right zone */}
          <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden shrink-0 rounded-full border border-slate-200 px-3 py-2 text-[13px] font-medium text-slate-600 hover:bg-slate-50 sm:block"
              >
                Admin
              </Link>
            )}
            <button
              onClick={logout}
              className="hidden shrink-0 rounded-full px-3 py-2 text-[13px] font-medium text-slate-500 hover:bg-slate-100 sm:block"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Row 2: product tabs + filters */}
        <div className="mx-auto flex w-full max-w-[1400px] items-center gap-3 px-5 pb-2.5 sm:px-8">
          <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
            {PRODUCTS.map((p) => {
              const on = product === p.id;
              const accent = productMeta[p.id]?.accent;
              return (
                <button
                  key={p.id}
                  onClick={() => setProduct(p.id)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition ${
                    on ? "text-white" : "text-slate-600 hover:bg-slate-100"
                  }`}
                  style={on ? { backgroundColor: accent || "#0f172a" } : undefined}
                >
                  {p.label}
                  <span className={`ml-1.5 text-[11px] ${on ? "text-white/70" : "text-slate-400"}`}>
                    {productCount(p.id)}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="shrink-0">
            <FilterMenu selected={selected} onToggle={toggle} onClear={clearFilters} />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1400px] px-5 py-6 sm:px-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            {loading ? "Loading…" : `${visible.length} asset${visible.length === 1 ? "" : "s"}`}
          </p>
          {activeFilterCount > 0 && (
            <button
              onClick={() => { clearFilters(); setQuery(""); }}
              className="text-[13px] font-medium text-brand hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <p className="py-20 text-center text-sm text-slate-400">Loading…</p>
        ) : error ? (
          <p className="py-20 text-center text-sm text-red-500">{error}</p>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center text-slate-400">
            <div className="text-4xl">🔍</div>
            <p className="mt-3 text-sm">No assets match. Try clearing a filter — or request it.</p>
            <button
              onClick={() => openRequest(query.trim())}
              className="mt-4 rounded-full bg-brand px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-brand/90"
            >
              Request a creative
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {visible.map((a) => (
              <AssetCard key={a.id} asset={a} onPreview={setPreview} />
            ))}
          </div>
        )}
      </main>

      <PreviewModal asset={preview} onClose={() => setPreview(null)} onPrev={goPrev} onNext={goNext} />
      <RequestModal open={requestOpen} onClose={() => setRequestOpen(false)} prefillTitle={requestPrefill} />
    </div>
  );
}
