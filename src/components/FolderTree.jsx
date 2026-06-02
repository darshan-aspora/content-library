export default function FolderTree({ tree, active, onSelect, countFor }) {
  return (
    <nav className="text-sm">
      <button
        onClick={() => onSelect("all")}
        className={`mb-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left font-medium transition ${
          active === "all" ? "bg-brand/10 text-brand" : "text-slate-700 hover:bg-slate-100"
        }`}
      >
        <span>🗂️</span> All assets
        <span className="ml-auto text-[11px] text-slate-400">{countFor("all")}</span>
      </button>

      {tree.map((pillar) => (
        <div key={pillar.id} className="mt-1">
          <button
            onClick={() => onSelect(pillar.id)}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition ${
              active === pillar.id ? "bg-brand/10 text-brand" : "text-slate-800 hover:bg-slate-100"
            }`}
          >
            <span>📁</span>
            <span className="truncate font-medium">{pillar.name}</span>
            <span className="ml-auto text-[11px] text-slate-400">{countFor(pillar.id)}</span>
          </button>
          {pillar.children.length > 0 && (
            <div className="ml-4 mt-0.5 flex flex-col gap-0.5 border-l border-slate-100 pl-2">
              {pillar.children.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onSelect(c.id)}
                  className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-left text-[13px] transition ${
                    active === c.id ? "bg-brand/10 font-medium text-brand" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="truncate">{c.name}</span>
                  <span className="ml-auto text-[11px] text-slate-400">{countFor(c.id)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
