import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import Logo from "../components/Logo";
import AssetsManager from "./AssetsManager";
import CategoryManager from "./CategoryManager";
import RequestsManager from "./RequestsManager";

export default function AdminApp() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("assets");
  const [categories, setCategories] = useState([]);
  const [assets, setAssets] = useState([]);
  const [requests, setRequests] = useState([]);

  const load = useCallback(() => {
    Promise.all([api.getCategories(), api.getAssets(), api.getRequests()]).then(([c, a, r]) => {
      setCategories(c);
      setAssets(a);
      setRequests(r);
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openRequests = requests.filter((r) => r.status !== "done").length;

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] items-center gap-4 px-6 py-3">
          <div className="flex items-center gap-2.5">
            <Logo className="text-xl" />
            <span className="hidden h-5 w-px bg-slate-200 sm:block" />
            <span className="hidden text-sm font-semibold text-slate-700 sm:block">Admin · Content Library</span>
          </div>
          <nav className="ml-6 flex gap-1">
            {["assets", "categories", "requests"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium capitalize transition ${
                  tab === t ? "bg-brand/10 text-brand" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {t}
                {t === "requests" && openRequests > 0 && (
                  <span className="rounded-full bg-brand px-1.5 text-[11px] font-semibold text-white">
                    {openRequests}
                  </span>
                )}
              </button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link to="/" className="rounded-full border border-slate-200 px-3 py-1.5 text-[13px] font-medium text-slate-600 hover:bg-slate-50">View library</Link>
            <span className="hidden text-[13px] text-slate-500 sm:inline">{user?.name}</span>
            <button onClick={logout} className="rounded-full px-3 py-1.5 text-[13px] font-medium text-slate-500 hover:bg-slate-100">Sign out</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-6 py-6">
        {tab === "assets" ? (
          <AssetsManager assets={assets} categories={categories} onChanged={load} />
        ) : tab === "categories" ? (
          <CategoryManager categories={categories} onChanged={load} />
        ) : (
          <RequestsManager requests={requests} onChanged={load} />
        )}
      </main>
    </div>
  );
}
