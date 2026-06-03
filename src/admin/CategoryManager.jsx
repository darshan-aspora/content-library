import { useMemo, useState } from "react";
import { api } from "../lib/api";
import { buildTree } from "../lib/meta";
import Modal from "./Modal";

const field = "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15";
const lbl = "mb-1 block text-[12px] font-medium text-slate-600";

function CategoryForm({ initial, parentName, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [note, setNote] = useState(initial?.note ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setErr("Name is required");
    setBusy(true);
    try {
      await onSubmit({ name: name.trim(), note: note.trim() });
    } catch (e) {
      setErr(e.message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      {parentName && <p className="text-[13px] text-slate-500">Inside <b>{parentName}</b></p>}
      <div>
        <label className={lbl}>Name</label>
        <input className={field} value={name} onChange={(e) => setName(e.target.value)} autoFocus />
      </div>
      <div>
        <label className={lbl}>Note (optional)</label>
        <input className={field} value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
      {err && <p className="text-sm text-red-500">{err}</p>}
      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
        <button type="submit" disabled={busy} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-60">
          {busy ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}

export default function CategoryManager({ categories, onChanged }) {
  const tree = useMemo(() => buildTree(categories), [categories]);
  const [modal, setModal] = useState(null); // { mode, parent?, category? }

  const close = () => setModal(null);
  const afterChange = () => { close(); onChanged(); };

  const del = async (cat) => {
    if (!confirm(`Delete "${cat.name}"?`)) return;
    try {
      await api.deleteCategory(cat.id);
      onChanged();
    } catch (e) {
      alert(e.message);
    }
  };

  const Actions = ({ cat, child }) => (
    <span className="ml-auto flex shrink-0 items-center gap-1">
      {!child && (
        <button onClick={() => setModal({ mode: "add", parent: cat })} className="rounded-full px-2.5 py-1 text-[12px] font-medium text-brand hover:bg-brand/10">+ Subfolder</button>
      )}
      <button onClick={() => setModal({ mode: "edit", category: cat })} className="rounded-full px-2.5 py-1 text-[12px] font-medium text-slate-500 hover:bg-slate-100">Rename</button>
      <button onClick={() => del(cat)} className="rounded-full px-2.5 py-1 text-[12px] font-medium text-red-500 hover:bg-red-50">Delete</button>
    </span>
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Categories</h2>
          <p className="text-[13px] text-slate-500">Pillars and their subfolders — two levels deep.</p>
        </div>
        <button onClick={() => setModal({ mode: "add", parent: null })} className="shrink-0 rounded-full bg-brand px-3.5 py-2 text-[13px] font-semibold text-white transition hover:bg-brand/90">
          + Add pillar
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {tree.map((p) => (
          <div key={p.id} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white ring-1 ring-slate-200/60">
            <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
              <span className="text-base">📁</span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900">{p.name}</p>
                {p.note && <p className="truncate text-[12px] text-slate-400">{p.note}</p>}
              </div>
              <Actions cat={p} />
            </div>
            <div className="flex flex-1 flex-col divide-y divide-slate-50">
              {p.children.map((c) => (
                <div key={c.id} className="flex items-center gap-2 px-4 py-2.5">
                  <span className="text-slate-300">↳</span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] text-slate-700">{c.name}</p>
                    {c.note && <p className="truncate text-[12px] text-slate-400">{c.note}</p>}
                  </div>
                  <Actions cat={c} child />
                </div>
              ))}
              {p.children.length === 0 && (
                <p className="px-4 py-3 text-[12px] text-slate-400">No subfolders yet.</p>
              )}
            </div>
          </div>
        ))}
        {tree.length === 0 && (
          <p className="col-span-full rounded-2xl border border-dashed border-slate-200 py-12 text-center text-slate-400">No categories yet.</p>
        )}
      </div>

      {modal && (
        <Modal
          title={modal.mode === "edit" ? "Rename category" : modal.parent ? "Add subfolder" : "Add pillar"}
          onClose={close}
        >
          <CategoryForm
            initial={modal.category}
            parentName={modal.parent?.name}
            onCancel={close}
            onSubmit={async (data) => {
              if (modal.mode === "edit") await api.updateCategory(modal.category.id, data);
              else await api.createCategory({ ...data, parentId: modal.parent?.id ?? null });
              afterChange();
            }}
          />
        </Modal>
      )}
    </div>
  );
}
