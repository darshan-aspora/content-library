import AssetThumb from "./AssetThumb";
import TypeIcon from "./TypeIcon";
import { typeMeta } from "../lib/meta";

export default function AssetCard({ asset, onPreview }) {
  const t = typeMeta[asset.type] ?? typeMeta.graphic;
  const hasFile = Boolean(asset.fileUrl);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.06)]">
      <button
        onClick={() => onPreview(asset)}
        className="relative block h-32 w-full border-b border-slate-100"
        title="Preview"
      >
        <AssetThumb asset={asset} className="h-32 w-full" />
        {asset.language === "ml" && (
          <span className="absolute right-2.5 top-2.5 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 ring-1 ring-slate-200">
            Malayalam
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col p-3">
        <div className="flex items-center gap-2">
          <TypeIcon
            type={asset.type}
            className="h-4 w-4 shrink-0"
            strokeWidth={1.8}
            style={{ color: t.accent }}
          />
          <h3 className="truncate text-[13px] font-semibold text-slate-900" title={asset.title}>
            {asset.title}
          </h3>
        </div>
        <p className="mt-0.5 truncate pl-6 text-[11px] text-slate-400">{asset.categoryName}</p>

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => onPreview(asset)}
            className="flex-1 rounded-lg border border-slate-200 px-2 py-1.5 text-[12px] font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Preview
          </button>
          <a
            href={hasFile ? asset.fileUrl : undefined}
            download={hasFile ? asset.fileName || "" : undefined}
            aria-disabled={!hasFile}
            onClick={(e) => !hasFile && e.preventDefault()}
            title={hasFile ? "Download" : "No file uploaded yet"}
            className={`flex-1 rounded-lg px-2 py-1.5 text-center text-[12px] font-medium transition ${
              hasFile
                ? "bg-brand text-white hover:bg-brand/90"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
}
