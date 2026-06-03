import { useRef } from "react";
import { typeMeta } from "../lib/meta";
import TypeIcon from "./TypeIcon";

// Shows the real media as the thumbnail:
//  - images/gifs → the image
//  - videos → a poster (if one exists) or the first frame, and plays muted on hover
//  - everything else → a clean, Drive-like placeholder with the file-type icon
export default function AssetThumb({ asset, className = "" }) {
  const t = typeMeta[asset.type] ?? typeMeta.graphic;
  const mime = asset.mimeType || "";
  const isImage = asset.fileUrl && /^image\//.test(mime);
  const isVideo = asset.fileUrl && /^video\//.test(mime);
  const videoRef = useRef(null);

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
      <div className={`relative overflow-hidden bg-black ${className}`}>
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
