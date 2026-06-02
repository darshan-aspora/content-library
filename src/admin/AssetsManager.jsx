import { useState } from "react";
import { api } from "../lib/api";
import { typeMeta, formatBytes } from "../lib/meta";
import Modal from "./Modal";
import AssetForm from "./AssetForm";

export default function AssetsManager({ assets, categories, onChanged }) {
  const [editing, setEditing] = useState(null); // asset or "new"
  const [busyId, setBusyId] = useState(null);

  const remove = async (asset) => {
    if (!confirm(`Delete "${asset.title}"? This removes the file too.`)) return;
    setBusyId(asset.id);
    try {
      await api.deleteAsset(asset.id);
      onChanged();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">{assets.length} assets</h2>
        <button onClick={() => setEditing("new")} className="rounded-lg bg-brand px-3.5 py-2 text-sm font-semibold text-white hover:bg-brand/90">
          + Upload asset
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-left text-[12px] uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-2.5 font-medium">Title</th>
              <th className="px-4 py-2.5 font-medium">Category</th>
              <th className="px-4 py-2.5 font-medium">Format</th>
              <th className="px-4 py-2.5 font-medium">File</th>
              <th className="px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {assets.map((a) => {
              const t = typeMeta[a.type] ?? typeMeta.graphic;
              return (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-medium text-slate-800">{a.title}</td>
                  <td className="px-4 py-2.5 text-slate-500">{a.categoryName}</td>
                  <td className="px-4 py-2.5">
                    <span className="rounded px-1.5 py-0.5 text-[11px] font-semibold text-white" style={{ backgroundColor: t.accent }}>
                      {t.label}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-[12px] text-slate-400">
                    {a.fileName ? `${a.fileName} · ${formatBytes(a.fileSize)}` : "— none —"}
                  </td>
                  <td className="px-4 py-2.5 text-right whitespace-nowrap">
                    <button onClick={() => setEditing(a)} className="rounded-md px-2 py-1 text-[13px] font-medium text-brand hover:bg-brand/10">
                      Edit
                    </button>
                    <button onClick={() => remove(a)} disabled={busyId === a.id} className="rounded-md px-2 py-1 text-[13px] font-medium text-red-500 hover:bg-red-50 disabled:opacity-50">
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {assets.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-400">No assets yet — upload your first one.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal title={editing === "new" ? "Upload asset" : "Edit asset"} onClose={() => setEditing(null)}>
          <AssetForm
            categories={categories}
            initial={editing === "new" ? null : editing}
            onCancel={() => setEditing(null)}
            onSaved={() => { setEditing(null); onChanged(); }}
          />
        </Modal>
      )}
    </div>
  );
}
