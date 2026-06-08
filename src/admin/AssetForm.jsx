import { useMemo, useState } from "react";
import { api } from "../lib/api";
import { facets, buildTree, sectionsByPod } from "../lib/meta";

const field = "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15";
const lbl = "mb-1 block text-[12px] font-medium text-slate-600";

// Flatten the tree into indented <option>s (pillars selectable too).
function categoryOptions(categories) {
  const tree = buildTree(categories);
  const out = [];
  tree.forEach((p) => {
    out.push({ id: p.id, label: p.name });
    p.children.forEach((c) => out.push({ id: c.id, label: `  ${c.name}` }));
  });
  return out;
}

export default function AssetForm({ categories, initial, onSaved, onCancel }) {
  const opts = useMemo(() => categoryOptions(categories), [categories]);
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    categoryId: initial?.categoryId ?? opts[0]?.id ?? "",
    pod: initial?.pod ?? "general",
    section: initial?.section ?? "",
    platform: initial?.platform ?? "all",
    language: initial?.language ?? "en",
    creatorType: initial?.creatorType ?? "any",
    type: initial?.type ?? "graphic",
    tags: (initial?.tags ?? []).join(", "),
  });
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!form.title.trim()) return setErr("Title is required");
    if (!form.categoryId) return setErr("Pick a category");
    setBusy(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append("file", file);
      if (initial) await api.updateAsset(initial.id, fd);
      else await api.createAsset(fd);
      onSaved();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className={lbl}>Title</label>
        <input className={field} value={form.title} onChange={set("title")} placeholder="e.g. Gold — buy 24K in seconds" />
      </div>

      <div>
        <label className={lbl}>Description</label>
        <textarea className={field} rows={2} value={form.description} onChange={set("description")} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={lbl}>Category</label>
          <select className={field} value={form.categoryId} onChange={set("categoryId")}>
            {opts.map((o) => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={lbl}>Product (POD)</label>
          <select
            className={field}
            value={form.pod}
            onChange={(e) => setForm((f) => ({ ...f, pod: e.target.value, section: "" }))}
          >
            {facets.pod.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className={lbl}>Sub-category</label>
          <select className={field} value={form.section} onChange={set("section")}>
            <option value="">— None —</option>
            {(sectionsByPod[form.pod] ?? []).map((o) => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={lbl}>Creator type</label>
          <select className={field} value={form.creatorType} onChange={set("creatorType")}>
            {facets.creatorType.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className={lbl}>Platform</label>
          <select className={field} value={form.platform} onChange={set("platform")}>
            {facets.platform.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className={lbl}>Language</label>
          <select className={field} value={form.language} onChange={set("language")}>
            {facets.language.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className={lbl}>Format {file ? "(auto from file)" : ""}</label>
          <select className={field} value={form.type} onChange={set("type")} disabled={!!file}>
            {facets.type.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className={lbl}>Tags (comma-separated)</label>
        <input className={field} value={form.tags} onChange={set("tags")} placeholder="gold, buy, 24k" />
      </div>

      <div>
        <label className={lbl}>File {initial?.fileName ? `(current: ${initial.fileName})` : ""}</label>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-slate-200" />
        <p className="mt-1 text-[11px] text-slate-400">Image, GIF, video, or PDF. Leave empty to keep the current file.</p>
      </div>

      {err && <p className="text-sm text-red-500">{err}</p>}

      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
          Cancel
        </button>
        <button type="submit" disabled={busy} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-60">
          {busy ? "Saving…" : initial ? "Save changes" : "Upload asset"}
        </button>
      </div>
    </form>
  );
}
