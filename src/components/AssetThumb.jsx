import { useRef } from "react";
import { typeMeta } from "../lib/meta";
import TypeIcon from "./TypeIcon";

// Shows the real media as the thumbnail, fully visible (no cropping):
//  - images/gifs → the whole image, fit to the tile height
//  - videos → the first frame as a poster, and plays muted on hover
//  - pdfs → the first page, rendered by the browser viewer
//  - everything else → a clean, Drive-like placeholder with the file-type icon
export default function AssetThumb({ asset, className = "" }) {
  const t = typeMeta[asset.type] ?? typeMeta.graphic;
  const mime = asset.mimeType || "";
  const isImage = asset.fileUrl && /^image\//.test(mime);
  const isVideo = asset.fileUrl && /^video\//.test(mime);
  const isPdf = asset.fileUrl && (asset.type === "pdf" || /pdf/.test(mime));
  const videoRef = useRef(null);

  if (isImage) {
    return (
      <div className={`relative overflow-hidden bg-white ${className}`}>
        <img
          src={asset.fileUrl}
          alt={asset.title}
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  if (isVideo) {
    const play = () => videoRef.current?.play().catch(() => {});
    const reset = () => {
      const v = videoRef.current;
      if (v) {
        v.pause();
        try { v.currentTime = 0.1; } catch {}
      }
    };
    return (
      <div className={`relative overflow-hidden bg-white ${className}`}>
        <video
          ref={videoRef}
          // #t=0.1 nudges the browser to render an actual frame, not a black poster.
          src={asset.thumbUrl ? undefined : `${asset.fileUrl}#t=0.1`}
          poster={asset.thumbUrl || undefined}
          muted
          loop
          playsInline
          preload="metadata"
          onMouseEnter={play}
          onMouseLeave={reset}
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  if (isPdf) {
    return (
      <div className={`relative overflow-hidden bg-white ${className}`}>
        <iframe
          // Show just the first page, no viewer chrome. The overlay keeps the
          // iframe non-interactive so the whole tile stays a single click target.
          src={`${asset.fileUrl}#page=1&toolbar=0&navpanes=0&view=FitH`}
          title={asset.title}
          loading="lazy"
          className="h-full w-full"
        />
        <div className="absolute inset-0" />
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
