// Clean, professional file-type icons (Lucide-style line icons) used on
// thumbnails and in card footers — Google Drive-like, no gradients.
const PATHS = {
  pdf: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M9 13h6M9 17h4" />
    </>
  ),
  script: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8M8 9h2M8 17h8" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="1.5" />
      <path d="m21 15-4.5-4.5L7 20" />
    </>
  ),
  video: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m10 9 5 3-5 3z" />
    </>
  ),
  gif: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7 8.5v7M17 8.5v7M11.5 8.5h-1.5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1.5v-3" />
    </>
  ),
  template: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </>
  ),
  graphic: (
    <>
      <rect x="3" y="3" width="10.5" height="10.5" rx="1.5" />
      <circle cx="16.5" cy="16.5" r="4.5" />
    </>
  ),
};

export default function TypeIcon({ type, className = "", strokeWidth = 1.6, style }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={style}
    >
      {PATHS[type] ?? PATHS.graphic}
    </svg>
  );
}
