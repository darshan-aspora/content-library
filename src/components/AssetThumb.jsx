import { typeMeta } from "../lib/meta";
import TypeIcon from "./TypeIcon";

// Shows the real media when it's an image/gif; otherwise a clean,
// Google Drive-like placeholder: neutral surface + centered file-type icon.
export default function AssetThumb({ asset, className = "" }) {
  const t = typeMeta[asset.type] ?? typeMeta.graphic;
  const isImage = asset.fileUrl && /^image\//.test(asset.mimeType || "");

  if (isImage) {
    return (
      <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
        <img
          src={asset.fileUrl}
          alt={asset.title}
          loading="lazy"
          className="h-full w-full object-cover object-top"
        />
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center bg-slate-50 ${className}`}>
      <span
        className="flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200"
        style={{ color: t.accent }}
      >
        <TypeIcon type={asset.type} className="h-7 w-7" />
      </span>
    </div>
  );
}
