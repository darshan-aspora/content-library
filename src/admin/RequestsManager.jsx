import { useState } from "react";
import { api } from "../lib/api";
import { labelOf } from "../lib/meta";

const STATUSES = [
  { id: "new", label: "New" },
  { id: "in-progress", label: "In progress" },
  { id: "done", label: "Done" },
];

const statusCls = {
  new: "bg-blue-50 text-blue-600 ring-blue-200",
  "in-progress": "bg-amber-50 text-amber-600 ring-amber-200",
  done: "bg-green-50 text-green-600 ring-green-200",
};

function fmtDate(d) {
  try {
    return new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "";
  }
}

export default function RequestsManager({ requests, onChanged }) {
  const [busyId, setBusyId] = useState(null);

  const setStatus = async (r, status) => {
    setBusyId(r.id);
    try {
      await api.updateRequest(r.id, status);
      onChanged();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (r) => {
    if (!confirm(`Delete request "${r.title}"?`)) return;
    setBusyId(r.id);
    try {
      await api.deleteRequest(r.id);
      onChanged();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusyId(null);
    }
  };

  const openCount = requests.filter((r) => r.status !== "done").length;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">
          {requests.length} request{requests.length === 1 ? "" : "s"}
          {openCount > 0 && <span className="ml-2 text-slate-400">· {openCount} open</span>}
        </h2>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-left text-[12px] uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-2.5 font-medium">Request</th>
              <th className="px-4 py-2.5 font-medium">Product</th>
              <th className="px-4 py-2.5 font-medium">Platform</th>
              <th className="px-4 py-2.5 font-medium">Requester</th>
              <th className="px-4 py-2.5 font-medium">Submitted</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map((r) => (
              <tr key={r.id} className="align-top hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-800">{r.title}</div>
                  {r.description && (
                    <div className="mt-0.5 max-w-md text-[12px] text-slate-500">{r.description}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-500">{labelOf("pod", r.pod)}</td>
                <td className="px-4 py-3 text-slate-500">{labelOf("platform", r.platform)}</td>
                <td className="px-4 py-3 text-[12px] text-slate-500">
                  {r.requesterName || r.requesterEmail ? (
                    <>
                      {r.requesterName && <div className="text-slate-700">{r.requesterName}</div>}
                      {r.requesterEmail && (
                        <a href={`mailto:${r.requesterEmail}`} className="text-brand hover:underline">
                          {r.requesterEmail}
                        </a>
                      )}
                    </>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-[12px] text-slate-400">{fmtDate(r.createdAt)}</td>
                <td className="px-4 py-3">
                  <select
                    value={r.status}
                    disabled={busyId === r.id}
                    onChange={(e) => setStatus(r, e.target.value)}
                    className={`rounded-full px-2.5 py-1 text-[12px] font-semibold capitalize ring-1 outline-none disabled:opacity-50 ${
                      statusCls[r.status] ?? statusCls.new
                    }`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s.id} value={s.id} className="bg-white text-slate-700">
                        {s.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button
                    onClick={() => remove(r)}
                    disabled={busyId === r.id}
                    className="rounded-md px-2 py-1 text-[13px] font-medium text-red-500 hover:bg-red-50 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                  No creative requests yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
