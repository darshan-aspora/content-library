import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { facets, buildTree } from "../lib/meta";
import FolderTree from "../components/FolderTree";
import FilterDropdown from "../components/FilterDropdown";
import Logo from "../components/Logo";
import AssetCard from "../components/AssetCard";
import PreviewModal from "../components/PreviewModal";
import RequestModal from "../components/RequestModal";

const BAR_FACETS = ["pod", "creatorType", "type", "platform"];
const BAR_LABEL = { pod: "Product", creatorType: "Creator", type: "Format", platform: "Platform" };

export default function LibraryPage() {
  const { user, isAdmin, logout } = useAuth();
  const [categories, setCategories] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [section, setSection] = useState("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState({});
  const [preview, setPreview] = useState(null);
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestPrefill, setRequestPrefill] = useState("");

  const openRequest = (prefill = "") => {
    setRequestPrefill(prefill);
    setRequestOpen(true);
  };

  useEffect(() => {
    Promise.all([api.getCategories(), api.getAssets()])
      .then(([cats, items]) => {
        setCategories(cats);
        setAssets(items);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const tree = useMemo(() => buildTree(categories), [categories]);
  const parentOf = useMemo(() => {
    const m = {};
    categories.forEach((c) => (m[c.id] = c.parentId || c.id));
    return m;
  }, [categories]);

  const toggle = (facet, value) =>
    setSelected((prev) => {
      const next = { ...prev };
      const set = new Set(next[facet] ?? []);
      set.has(value) ? set.delete(value) : set.add(value);
      next[facet] = set;
      return next;
    });

  const clearAll = () => {
    setSelected({});
    setQuery("");
  };

  const q = query.trim().toLowerCase();

  const inSection = (a, sec) =>
    sec === "all" || a.categoryId === sec || parentOf[a.categoryId] === sec;

  const passesFilters = (a) => {
    for (const f of BAR_FACETS) {
      const set = selected[f];
      if (set && set.size > 0 && !set.has(a[f])) return false;
    }
    if (q) {
      const hay = [a.title, a.description, a.categoryName, ...(a.tags || [])]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  };

  const visible = useMemo(
    () => assets.filter((a) => inSection(a, section) && passesFilters(a)),
    [assets, section, q, selected, parentOf]
  );

  const countFor = (sec) =>
    assets.filter((a) => inSection(a, sec) && passesFilters(a)).length;

  const activeFilterCount =
    Object.values(selected).reduce((acc, s) => acc + (s?.size ?? 0), 0) + (q ? 1 : 0);

  return (
    <div className="min-h-full">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] items-center gap-4 px-6 py-3">
          <div className="flex items-center gap-2.5">
            <Logo className="text-2xl" />
            <span className="hidden h-5 w-px bg-slate-200 sm:block" />
            <span className="hidden text-sm font-semibold text-slate-700 sm:block">Content Library</span>
          </div>
          <div className="relative ml-auto w-full max-w-sm">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search assets, tags…"
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15"
            />
          </div>
          <button
            onClick={() => openRequest("")}
            className="shrink-0 rounded-full bg-brand px-3.5 py-1.5 text-[13px] font-semibold text-white transition hover:bg-brand/90"
          >
            Request a creative
          </button>
          {isAdmin && (
            <Link
              to="/admin"
              className="shrink-0 rounded-full border border-slate-200 px-3 py-1.5 text-[13px] font-medium text-slate-600 hover:bg-slate-50"
            >
              Admin
            </Link>
          )}
          <span className="hidden text-[13px] text-slate-500 lg:inline">{user?.name}</span>
          <button
            onClick={logout}
            className="shrink-0 rounded-full px-3 py-1.5 text-[13px] font-medium text-slate-500 hover:bg-slate-100"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1200px] gap-6 px-6 py-6">
        {/* Sidebar */}
        <aside className="hidden w-56 shrink-0 md:block">
          {!loading && <FolderTree tree={tree} active={section} onSelect={setSection} countFor={countFor} />}
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1">
          {/* Toolbar */}
          <div className="mb-5 flex flex-wrap items-center gap-2">
            {BAR_FACETS.map((f) => (
              <FilterDropdown
                key={f}
                label={BAR_LABEL[f]}
                options={facets[f].filter(
                  (o) => !(f === "platform" && o.id === "all") && !(f === "creatorType" && o.id === "any")
                )}
                selected={selected[f] ?? new Set()}
                onToggle={(v) => toggle(f, v)}
              />
            ))}
            {activeFilterCount > 0 && (
              <button onClick={clearAll} className="text-[13px] font-medium text-brand hover:underline">
                Clear
              </button>
            )}
            <span className="ml-auto text-[13px] text-slate-400">
              {visible.length} asset{visible.length === 1 ? "" : "s"}
            </span>
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((a) => (
                <AssetCard key={a.id} asset={a} onPreview={setPreview} />
              ))}
            </div>
          )}
        </main>
      </div>

      <PreviewModal asset={preview} onClose={() => setPreview(null)} />
      <RequestModal
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        prefillTitle={requestPrefill}
      />
    </div>
  );
}
