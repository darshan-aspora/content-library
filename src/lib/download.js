// Force a real file download. The HTML `download` attribute is ignored for
// cross-origin URLs (our media lives on Supabase Storage), so the browser just
// navigates to / opens the file. Fetching it as a Blob and clicking a synthetic
// object-URL anchor downloads it for real. Falls back to opening in a new tab
// if the fetch is blocked (e.g. CORS).
export async function downloadFile(url, filename = "download") {
  if (!url) return;
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Revoke after a tick so the download has a chance to start.
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
