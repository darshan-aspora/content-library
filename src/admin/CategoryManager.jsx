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

  const Row = ({ cat, child }) => (
    <div className={`flex items-center gap-2 py-1.5 ${child ? "pl-6" : ""}`}>
      <span>{child ? "↳" : "📁"}</span>
      <span className={`${child ? "text-[13px] text-slate-700" : "font-medium text-slate-800"}`}>{cat.name}</span>
      {cat.note && <span className="truncate text-[12px] text-slate-400">— {cat.note}</span>}
      <span className="ml-auto flex gap-1">
        {!child && (
          <button onClick={() => setModal({ mode: "add", parent: cat })} className="rounded-md px-2 py-0.5 text-[12px] font-medium text-brand hover:bg-brand/10">+ Subfolder</button>
        )}
        <button onClick={() => setModal({ mode: "edit", category: cat })} className="rounded-md px-2 py-0.5 text-[12px] font-medium text-slate-500 hover:bg-slate-100">Rename</button>
        <button onClick={() => del(cat)} className="rounded-md px-2 py-0.5 text-[12px] font-medium text-red-500 hover:bg-red-50">Delete</button>
      </span>
    </div>
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">Categories</h2>
        <button onClick={() => setModal({ mode: "add", parent: null })} className="rounded-lg bg-brand px-3.5 py-2 text-sm font-semibold text-white hover:bg-brand/90">
          + Add pillar
        </button>
      </div>

      <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white px-4">
        {tree.map((p) => (
          <div key={p.id} className="py-1">
            <Row cat={p} />
            {p.children.map((c) => <Row key={c.id} cat={c} child />)}
          </div>
        ))}
        {tree.length === 0 && <p className="py-10 text-center text-slate-400">No categories yet.</p>}
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
