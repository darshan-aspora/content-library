import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { facets } from "../lib/meta";

const EMPTY = {
  title: "",
  description: "",
  pod: "general",
  platform: "all",
};

export default function RequestModal({ open, onClose, prefillTitle = "" }) {
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);

  // Reset whenever the modal is (re)opened.
  useEffect(() => {
    if (open) {
      setForm({ ...EMPTY, title: prefillTitle });
      setErr("");
      setDone(false);
      setBusy(false);
    }
  }, [open, prefillTitle]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setErr("Please describe what you need.");
      return;
    }
    setErr("");
    setBusy(true);
    try {
      await api.createRequest(form);
      setDone(true);
    } catch (e) {
      setErr(e.message);
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 py-10"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Request a creative</h2>
            <p className="text-xs text-slate-400">Can't find what you need? Tell the team and we'll create it.</p>
          </div>
          <button onClick={onClose} className="text-xl leading-none text-slate-400 hover:text-slate-600">×</button>
        </div>

        {done ? (
          <div className="flex flex-col items-center gap-2 px-5 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-2xl text-green-600">✓</div>
            <h3 className="text-base font-semibold text-slate-900">Request submitted</h3>
            <p className="max-w-sm text-sm text-slate-500">
              Thanks! The content team can now see your request and will get it ready.
            </p>
            <button
              onClick={onClose}
              className="mt-3 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4 px-5 py-4">
            <Field label="What do you need?" required>
              <input
                autoFocus
                value={form.title}
                onChange={set("title")}
                placeholder="e.g. Reel cover for a remittance offer"
                className={inputCls}
              />
            </Field>

            <Field label="Details (optional)">
              <textarea
                value={form.description}
                onChange={set("description")}
                rows={3}
                placeholder="Context, message, references, dimensions, anything that helps…"
                className={`${inputCls} resize-none`}
              />
            </Field>

            <Field label="Product">
              <Pills
                options={facets.pod}
                value={form.pod}
                onChange={(id) => setForm((f) => ({ ...f, pod: id }))}
              />
            </Field>

            <Field label="Platform">
              <Pills
                options={facets.platform}
                value={form.platform}
                onChange={(id) => setForm((f) => ({ ...f, platform: id }))}
              />
            </Field>

            {err && <p className="text-sm text-red-500">{err}</p>}

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy}
                className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-60"
              >
                {busy ? "Submitting…" : "Submit request"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15";

function Field({ label, required, children }) {
  return (
    <div className="block">
      <span className="mb-1.5 block text-[12px] font-medium text-slate-600">
        {label} {required && <span className="text-red-400">*</span>}
      </span>
      {children}
    </div>
  );
}

// Single-select pills.
function Pills({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`rounded-full border px-3 py-1.5 text-[13px] font-medium transition ${
              on
                ? "border-brand bg-brand/5 text-brand"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
