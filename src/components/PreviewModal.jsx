import { useEffect } from "react";
import { productMeta, typeMeta, labelOf, formatBytes } from "../lib/meta";
import { downloadFile } from "../lib/download";
import TypeIcon from "./TypeIcon";

function MediaView({ asset }) {
  const mime = asset.mimeType || "";
  if (!asset.fileUrl) {
    const t = typeMeta[asset.type] ?? typeMeta.graphic;
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-3 text-slate-400">
        <span
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15"
          style={{ color: t.accent }}
        >
          <TypeIcon type={asset.type} className="h-8 w-8" />
        </span>
        <span className="text-sm text-slate-300">No file uploaded yet</span>
      </div>
    );
  }
  if (/^image\//.test(mime))
    return <img src={asset.fileUrl} alt={asset.title} className="max-h-[78vh] w-auto rounded-xl object-contain shadow-2xl" />;
  if (/^video\//.test(mime))
    return <video src={asset.fileUrl} controls autoPlay className="max-h-[78vh] w-auto rounded-xl bg-black shadow-2xl" />;
  if (mime === "application/pdf")
    // #toolbar=0&navpanes=0 hides the browser PDF viewer's header + thumbnail rail.
    return (
      <iframe
        src={`${asset.fileUrl}#toolbar=0&navpanes=0&view=FitH`}
        title={asset.title}
        className="h-[78vh] w-[60vw] max-w-3xl rounded-xl border border-white/10 bg-white"
      />
    );
  return (
    <div className="flex h-[50vh] w-[80vw] max-w-lg items-center justify-center rounded-xl bg-white/5 text-sm text-slate-300">
      Preview not available for this file type — use Download.
    </div>
  );
}

function NavButton({ dir, onClick }) {
  if (!onClick) return null;
  const isPrev = dir === "prev";
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={isPrev ? "Previous" : "Next"}
      className={`absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 ${
        isPrev ? "left-4" : "right-4"
      }`}
    >
      <svg viewBox="0 0 20 20" fill="currentColor" className={`h-5 w-5 ${isPrev ? "" : "rotate-180"}`}>
        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 0 1 .02 1.06L9.06 10l3.75 3.71a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.04 0Z" clipRule="evenodd" />
      </svg>
    </button>
  );
}

export default function PreviewModal({ asset, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onPrev?.();
      else if (e.key === "ArrowRight") onNext?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  if (!asset) return null;
  const hasFile = Boolean(asset.fileUrl);
  const p = productMeta[asset.pod] ?? productMeta.general;

  return (
    <div className="fixed inset-0 z-50 flex bg-slate-950/85 backdrop-blur-sm" onClick={onClose}>
      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl text-white backdrop-blur transition hover:bg-white/20"
      >
        ×
      </button>

      <NavButton dir="prev" onClick={onPrev} />
      <NavButton dir="next" onClick={onNext} />

      {/* Stage */}
      <div className="flex flex-1 items-center justify-center p-6 md:p-12" onClick={onClose}>
        <div onClick={(e) => e.stopPropagation()}>
          <MediaView asset={asset} />
        </div>
      </div>

      {/* Detail rail */}
      <aside
        className="hidden w-80 shrink-0 flex-col overflow-y-auto border-l border-white/10 bg-slate-900/60 p-6 text-slate-200 md:flex"
        onClick={(e) => e.stopPropagation()}
      >
        <span
          className="mb-3 inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
          style={{ backgroundColor: `${p.accent}33`, color: "#fff" }}
        >
          {p.label}
        </span>
        <h2 className="text-lg font-semibold text-white">{asset.title}</h2>
        <p className="mt-0.5 text-xs text-slate-400">{asset.categoryName}</p>

        {asset.description && <p className="mt-4 text-sm leading-relaxed text-slate-300">{asset.description}</p>}

        <dl className="mt-5 space-y-2 text-[13px]">
          <Row label="Format" value={typeMeta[asset.type]?.label ?? asset.type} />
          <Row label="Creator" value={labelOf("creatorType", asset.creatorType)} />
          {asset.platform !== "all" && <Row label="Platform" value={labelOf("platform", asset.platform)} />}
          <Row label="Language" value={labelOf("language", asset.language)} />
          {asset.fileSize ? <Row label="Size" value={formatBytes(asset.fileSize)} /> : null}
        </dl>

        {asset.tags?.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {asset.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-slate-300">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <button
          type="button"
          disabled={!hasFile}
          onClick={() => downloadFile(asset.fileUrl, asset.fileName || asset.title || "download")}
          className={`mt-6 rounded-xl px-4 py-2.5 text-center text-sm font-semibold transition ${
            hasFile ? "bg-white text-slate-900 hover:bg-slate-100" : "cursor-not-allowed bg-white/10 text-slate-500"
          }`}
        >
          {hasFile ? "Download" : "No file yet"}
        </button>
      </aside>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-400">{label}</dt>
      <dd className="text-right font-medium text-slate-100">{value}</dd>
    </div>
  );
}
