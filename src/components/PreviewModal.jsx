import { useEffect } from "react";
import { typeMeta, labelOf, formatBytes } from "../lib/meta";
import TypeIcon from "./TypeIcon";

function MediaView({ asset }) {
  const mime = asset.mimeType || "";
  if (!asset.fileUrl) {
    const t = typeMeta[asset.type] ?? typeMeta.graphic;
    return (
      <div className="flex h-72 flex-col items-center justify-center gap-3 rounded-lg bg-slate-50 text-slate-400">
        <span
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
          style={{ color: t.accent }}
        >
          <TypeIcon type={asset.type} className="h-8 w-8" />
        </span>
        <span className="text-sm">No file uploaded yet</span>
      </div>
    );
  }
  if (/^image\//.test(mime))
    return <img src={asset.fileUrl} alt={asset.title} className="max-h-[60vh] w-full rounded-lg object-contain" />;
  if (/^video\//.test(mime))
    return <video src={asset.fileUrl} controls className="max-h-[60vh] w-full rounded-lg bg-black" />;
  if (mime === "application/pdf")
    return <iframe src={asset.fileUrl} title={asset.title} className="h-[60vh] w-full rounded-lg border border-slate-200" />;
  return (
    <div className="flex h-72 items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-500">
      Preview not available for this file type — use Download.
    </div>
  );
}

export default function PreviewModal({ asset, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!asset) return null;
  const hasFile = Boolean(asset.fileUrl);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{asset.title}</h2>
            <p className="text-xs text-slate-400">{asset.categoryName}</p>
          </div>
          <button onClick={onClose} className="text-xl leading-none text-slate-400 hover:text-slate-600">
            ×
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4">
          <MediaView asset={asset} />

          {asset.description && (
            <p className="mt-4 text-sm text-slate-600">{asset.description}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-[12px] text-slate-500">
            <span><b className="font-medium text-slate-700">Product:</b> {labelOf("pod", asset.pod)}</span>
            <span><b className="font-medium text-slate-700">Creator:</b> {labelOf("creatorType", asset.creatorType)}</span>
            {asset.platform !== "all" && <span><b className="font-medium text-slate-700">Platform:</b> {labelOf("platform", asset.platform)}</span>}
            <span><b className="font-medium text-slate-700">Language:</b> {labelOf("language", asset.language)}</span>
            {asset.fileSize ? <span><b className="font-medium text-slate-700">Size:</b> {formatBytes(asset.fileSize)}</span> : null}
          </div>

          {asset.tags?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {asset.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-3">
          <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
            Close
          </button>
          <a
            href={hasFile ? asset.fileUrl : undefined}
            download={hasFile ? asset.fileName || "" : undefined}
            onClick={(e) => !hasFile && e.preventDefault()}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              hasFile ? "bg-brand text-white hover:bg-brand/90" : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
}
