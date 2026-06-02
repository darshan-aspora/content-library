// Aspora wordmark, recreated as inline SVG so it stays crisp at any size.
// The four-point sparkle stands in for the "o" in "asp(o)ra".
export default function Logo({ className = "" }) {
  return (
    <span
      className={`inline-flex select-none items-center font-black lowercase leading-none tracking-tight text-[#4d1a9e] ${className}`}
      aria-label="aspora"
    >
      <span aria-hidden="true">asp</span>
      <svg
        viewBox="0 0 100 100"
        fill="currentColor"
        aria-hidden="true"
        className="mx-[0.03em] h-[0.78em] w-[0.78em]"
      >
        <path d="M50 1c5.3 28.4 20.3 43.4 48.7 48.7C70.3 55 55.3 70 50 98.4 44.7 70 29.7 55 1.3 49.7 29.7 44.4 44.7 29.4 50 1Z" />
      </svg>
      <span aria-hidden="true">ra</span>
    </span>
  );
}
