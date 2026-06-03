import AssetThumb from "./AssetThumb";
import { productMeta, typeMeta } from "../lib/meta";

// Mobbin-style card: a tall, phone-aspect media tile that opens on click,
// with the title + product chip sitting quietly underneath. No inline
// buttons — the whole tile is the affordance, detail lives in the lightbox.
export default function AssetCard({ asset, onPreview }) {
  const p = productMeta[asset.pod] ?? productMeta.general;
  const t = typeMeta[asset.type] ?? typeMeta.graphic;
  const isVideo = asset.type === "video" || /^video\//.test(asset.mimeType || "");

  return (
    <div className="group flex flex-col">
      <button
        onClick={() => onPreview(asset)}
        title={asset.title}
        className="relative block w-full overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200/70 transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] group-hover:ring-slate-300"
      >
        <div className="aspect-[402/844]">
          <AssetThumb asset={asset} className="h-full w-full" />
        </div>

        {/* Top-right badges */}
        <div className="pointer-events-none absolute right-2.5 top-2.5 flex gap-1.5">
          {asset.language === "ml" && (
            <span className="rounded-md bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 shadow-sm backdrop-blur">
              ML
            </span>
          )}
        </div>

        {/* Centered play button for videos */}
        {isVideo && (
          <span className="pointer-events-none absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition group-hover:bg-black/60">
            <svg viewBox="0 0 20 20" fill="currentColor" className="ml-0.5 h-5 w-5">
              <path d="M6.5 4.5v11l9-5.5-9-5.5Z" />
            </svg>
          </span>
        )}

        {/* Hover veil */}
        <div className="absolute inset-0 bg-slate-900/0 transition group-hover:bg-slate-900/[0.04]" />
      </button>

      <div className="mt-2.5 px-0.5">
        <h3 className="truncate text-[13px] font-semibold text-slate-900" title={asset.title}>
          {asset.title}
        </h3>
        <div className="mt-1 flex items-center gap-1.5">
          <span
            className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-medium"
            style={{ backgroundColor: `${p.accent}1a`, color: p.accent }}
          >
            {p.label}
          </span>
          <span className="truncate text-[11px] text-slate-400">{t.label}</span>
        </div>
      </div>
    </div>
  );
}
