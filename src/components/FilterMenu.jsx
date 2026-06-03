import { useEffect, useRef, useState } from "react";
import { facets } from "../lib/meta";

// Single consolidated filter popover (Mobbin keeps one "Filters" button rather
// than a row of dropdowns). Product lives in the header tabs, so this covers
// the secondary facets: Format, Platform, Creator, Language.
const GROUPS = [
  { facet: "type", label: "Format" },
  { facet: "platform", label: "Platform", omit: "all" },
  { facet: "creatorType", label: "Creator", omit: "any" },
  { facet: "language", label: "Language" },
];

export default function FilterMenu({ selected, onToggle, onClear }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const count = Object.values(selected).reduce((acc, s) => acc + (s?.size ?? 0), 0);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-medium transition ${
          count > 0 ? "border-brand bg-brand/5 text-brand" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
        }`}
      >
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
          <path strokeLinecap="round" d="M3 5h14M6 10h8M9 15h2" />
        </svg>
        Filters
        {count > 0 && (
          <span className="rounded-full bg-brand px-1.5 text-[11px] font-semibold text-white">{count}</span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
          <div className="flex items-center justify-between px-1 pb-2">
            <span className="text-[12px] font-semibold uppercase tracking-wide text-slate-400">Filters</span>
            {count > 0 && (
              <button onClick={onClear} className="text-[12px] font-medium text-brand hover:underline">
                Clear all
              </button>
            )}
          </div>
          <div className="max-h-[60vh] space-y-3 overflow-y-auto">
            {GROUPS.map(({ facet, label, omit }) => (
              <div key={facet}>
                <p className="px-1 pb-1.5 text-[12px] font-semibold text-slate-700">{label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {facets[facet]
                    .filter((o) => o.id !== omit)
                    .map((opt) => {
                      const on = selected[facet]?.has(opt.id);
                      return (
                        <button
                          key={opt.id}
                          onClick={() => onToggle(facet, opt.id)}
                          className={`rounded-full border px-2.5 py-1 text-[12px] transition ${
                            on
                              ? "border-brand bg-brand/10 font-medium text-brand"
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
