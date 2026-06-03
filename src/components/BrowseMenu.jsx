import { useEffect, useRef, useState } from "react";
import FolderTree from "./FolderTree";

// Compact header "Browse" dropdown — the folder tree moved off the page into a
// menu now that the layout is full-width. Shows the active folder name on the
// trigger; selecting a folder closes the menu.
export default function BrowseMenu({ tree, active, activeName, onSelect, countFor }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const select = (id) => {
    onSelect(id);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-medium transition ${
          active !== "all"
            ? "border-brand bg-brand/5 text-brand"
            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
        }`}
      >
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 6.5A1.5 1.5 0 0 1 4 5h3l1.5 1.5H16A1.5 1.5 0 0 1 17.5 8v6A1.5 1.5 0 0 1 16 15.5H4A1.5 1.5 0 0 1 2.5 14V6.5Z" />
        </svg>
        <span className="max-w-[10rem] truncate">{active === "all" ? "Browse folders" : activeName}</span>
        <svg viewBox="0 0 20 20" fill="currentColor" className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}>
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 z-30 mt-2 max-h-[70vh] w-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
          <FolderTree tree={tree} active={active} onSelect={select} countFor={countFor} />
        </div>
      )}
    </div>
  );
}
