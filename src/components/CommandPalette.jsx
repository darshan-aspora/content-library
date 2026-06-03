import { useEffect, useMemo, useRef, useState } from "react";
import { PRODUCTS, facets, typeMeta } from "../lib/meta";

// ⌘K overlay. A single flat list of "commands" (jump to a product, a folder,
// or a format) that you type to filter and arrow through — the Mobbin/Linear
// pattern. Selecting a command applies the jump and closes the palette.
export default function CommandPalette({ open, onClose, tree, onProduct, onFolder, onFormat, onSearch }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);

  // Flatten everything navigable into one command list with a group label.
  const commands = useMemo(() => {
    const out = [];
    PRODUCTS.forEach((p) =>
      out.push({
        group: "Products",
        label: p.label,
        hint: p.id === "all" ? "Everything" : "Product",
        icon: "◆",
        run: () => onProduct(p.id),
      })
    );
    tree.forEach((pillar) => {
      out.push({ group: "Folders", label: pillar.name, hint: "Pillar", icon: "📁", run: () => onFolder(pillar.id) });
      pillar.children?.forEach((c) =>
        out.push({ group: "Folders", label: `${pillar.name} › ${c.name}`, hint: "Folder", icon: "📂", run: () => onFolder(c.id) })
      );
    });
    facets.type.forEach((f) =>
      out.push({
        group: "Formats",
        label: typeMeta[f.id]?.label ?? f.label,
        hint: "Format",
        icon: typeMeta[f.id]?.emoji ?? "🏷️",
        run: () => onFormat(f.id),
      })
    );
    return out;
  }, [tree, onProduct, onFolder, onFormat]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const matches = needle
      ? commands.filter((c) => c.label.toLowerCase().includes(needle) || c.group.toLowerCase().includes(needle))
      : commands;
    // First entry: free-text search over the asset grid.
    if (needle) {
      return [
        { group: "Search", label: `Search “${q.trim()}”`, hint: "Filter grid", icon: "⌕", run: () => onSearch(q.trim()) },
        ...matches,
      ];
    }
    return matches;
  }, [q, commands, onSearch]);

  // Reset + focus on open.
  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      const id = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(id);
    }
  }, [open]);

  useEffect(() => setActive(0), [q]);

  if (!open) return null;

  const choose = (cmd) => {
    cmd?.run();
    onClose();
  };

  const onKey = (e) => {
    if (e.key === "Escape") return onClose();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(filtered[active]);
    }
  };

  // Group consecutive items for section headers.
  let lastGroup = null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 p-4 pt-[12vh]" onClick={onClose}>
      <div
        className="flex max-h-[70vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKey}
      >
        <div className="flex items-center gap-2.5 border-b border-slate-100 px-4 py-3">
          <span className="text-slate-400">⌕</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Jump to a product, folder, or format…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
          <kbd className="rounded border border-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">Esc</kbd>
        </div>

        <div className="overflow-y-auto py-1.5">
          {filtered.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-slate-400">No matches.</p>
          ) : (
            filtered.map((cmd, i) => {
              const showHeader = cmd.group !== lastGroup;
              lastGroup = cmd.group;
              return (
                <div key={`${cmd.group}-${cmd.label}-${i}`}>
                  {showHeader && (
                    <p className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      {cmd.group}
                    </p>
                  )}
                  <button
                    onMouseEnter={() => setActive(i)}
                    onClick={() => choose(cmd)}
                    className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm ${
                      i === active ? "bg-brand/10 text-brand" : "text-slate-700"
                    }`}
                  >
                    <span className="w-4 text-center text-[13px]">{cmd.icon}</span>
                    <span className="flex-1 truncate">{cmd.label}</span>
                    <span className="text-[11px] text-slate-400">{cmd.hint}</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
