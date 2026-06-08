// Aspora brand kit — logos, logomarks (favicons) and square icons, one library
// item per source file so every colour/background/format variant is downloadable
// on its own. All live under pod "general" in the "Logos & Brand Kit" category
// (slug: brand-logos). `sourceFile` is the path inside the shared Logo zip so
// each record maps 1:1 to the file that should be attached to it.
//
// type "graphic" is a sensible default; on upload the API re-derives it from the
// file's mimetype.
const LOGO = "Full Aspora logo — logomark plus wordmark.";
const FAVICON = "Aspora logomark (symbol only), optimised for favicons and small spaces.";
const ICON = "Square Aspora icon for profile pictures and app/social display.";

export const brandAssets = [
  // ── Full Logo ─────────────────────────────────────────────────────────
  { title: "Aspora Logo — Black on White (JPG)", desc: LOGO, tags: ["logo", "wordmark", "black", "on-white", "jpg"], sourceFile: "Full Logo/JPG/Aspora logo black on white.jpg" },
  { title: "Aspora Logo — Purple on White (JPG)", desc: LOGO, tags: ["logo", "wordmark", "purple", "on-white", "jpg"], sourceFile: "Full Logo/JPG/Aspora logo purple on white.jpg" },
  { title: "Aspora Logo — White on Purple (JPG)", desc: LOGO, tags: ["logo", "wordmark", "white", "on-purple", "jpg"], sourceFile: "Full Logo/JPG/Aspora logo white on purple.jpg" },
  { title: "Aspora Logo — Black, Transparent (PNG)", desc: LOGO, tags: ["logo", "wordmark", "black", "transparent", "png"], sourceFile: "Full Logo/PNG/Aspora logo black Transparent.png" },
  { title: "Aspora Logo — Purple, Transparent (PNG)", desc: LOGO, tags: ["logo", "wordmark", "purple", "transparent", "png"], sourceFile: "Full Logo/PNG/Aspora logo purple Transparent.png" },
  { title: "Aspora Logo — Purple on White (PNG)", desc: LOGO, tags: ["logo", "wordmark", "purple", "on-white", "png"], sourceFile: "Full Logo/PNG/Aspora logo purple on white.png" },
  { title: "Aspora Logo — White, Transparent (PNG)", desc: LOGO, tags: ["logo", "wordmark", "white", "transparent", "png"], sourceFile: "Full Logo/PNG/Aspora logo white Transparent.png" },
  { title: "Aspora Logo — White on Purple (PNG)", desc: LOGO, tags: ["logo", "wordmark", "white", "on-purple", "png"], sourceFile: "Full Logo/PNG/Aspora logo white on purple.png" },
  { title: "Aspora Logo — Black (SVG)", desc: LOGO, tags: ["logo", "wordmark", "black", "transparent", "svg", "vector"], sourceFile: "Full Logo/SVG (Vector)/Aspora logo black.svg" },
  { title: "Aspora Logo — Purple on White (SVG)", desc: LOGO, tags: ["logo", "wordmark", "purple", "on-white", "svg", "vector"], sourceFile: "Full Logo/SVG (Vector)/Aspora logo purple on white.svg" },
  { title: "Aspora Logo — Purple (SVG)", desc: LOGO, tags: ["logo", "wordmark", "purple", "transparent", "svg", "vector"], sourceFile: "Full Logo/SVG (Vector)/Aspora logo purple.svg" },
  { title: "Aspora Logo — White on Purple (SVG)", desc: LOGO, tags: ["logo", "wordmark", "white", "on-purple", "svg", "vector"], sourceFile: "Full Logo/SVG (Vector)/Aspora logo white on purple.svg" },
  { title: "Aspora Logo — White (SVG)", desc: LOGO, tags: ["logo", "wordmark", "white", "transparent", "svg", "vector"], sourceFile: "Full Logo/SVG (Vector)/Aspora logo white.svg" },

  // ── Favicon (logomark) ──────────────────────────────────────────────────
  { title: "Aspora Favicon — Black on White (JPG)", desc: FAVICON, tags: ["favicon", "logomark", "black", "on-white", "jpg"], sourceFile: "Favicon/JPG/Aspora favicon black on white.jpg" },
  { title: "Aspora Favicon — Purple on White (JPG)", desc: FAVICON, tags: ["favicon", "logomark", "purple", "on-white", "jpg"], sourceFile: "Favicon/JPG/Aspora favicon purple on white.jpg" },
  { title: "Aspora Favicon — White on Purple (JPG)", desc: FAVICON, tags: ["favicon", "logomark", "white", "on-purple", "jpg"], sourceFile: "Favicon/JPG/Aspora favicon white on purple.jpg" },
  { title: "Aspora Favicon — Black on White (PNG)", desc: FAVICON, tags: ["favicon", "logomark", "black", "on-white", "png"], sourceFile: "Favicon/PNG/Aspora favicon black on white.png" },
  { title: "Aspora Favicon — Black, Transparent (PNG)", desc: FAVICON, tags: ["favicon", "logomark", "black", "transparent", "png"], sourceFile: "Favicon/PNG/Aspora favicon black transparent.png" },
  { title: "Aspora Favicon — Purple on White (PNG)", desc: FAVICON, tags: ["favicon", "logomark", "purple", "on-white", "png"], sourceFile: "Favicon/PNG/Aspora favicon purple on white.png" },
  { title: "Aspora Favicon — Purple, Transparent (PNG)", desc: FAVICON, tags: ["favicon", "logomark", "purple", "transparent", "png"], sourceFile: "Favicon/PNG/Aspora favicon purple transparent.png" },
  { title: "Aspora Favicon — White on Purple (PNG)", desc: FAVICON, tags: ["favicon", "logomark", "white", "on-purple", "png"], sourceFile: "Favicon/PNG/Aspora favicon white on purple.png" },
  { title: "Aspora Favicon — White, Transparent (PNG)", desc: FAVICON, tags: ["favicon", "logomark", "white", "transparent", "png"], sourceFile: "Favicon/PNG/Aspora favicon white transparent.png" },
  { title: "Aspora Favicon — Black (SVG)", desc: FAVICON, tags: ["favicon", "logomark", "black", "transparent", "svg", "vector"], sourceFile: "Favicon/SVG (Vector)/Aspora logomark black.svg" },
  { title: "Aspora Favicon — Purple on White (SVG)", desc: FAVICON, tags: ["favicon", "logomark", "purple", "on-white", "svg", "vector"], sourceFile: "Favicon/SVG (Vector)/Aspora logomark purple on white.svg" },
  { title: "Aspora Favicon — White on Black (SVG)", desc: FAVICON, tags: ["favicon", "logomark", "white", "on-black", "svg", "vector"], sourceFile: "Favicon/SVG (Vector)/Aspora logomark white on black.svg" },
  { title: "Aspora Favicon — White on Purple (SVG)", desc: FAVICON, tags: ["favicon", "logomark", "white", "on-purple", "svg", "vector"], sourceFile: "Favicon/SVG (Vector)/Aspora logomark white on purple.svg" },

  // ── Square (DP / Icon) ────────────────────────────────────────────────
  { title: "Aspora Icon — Purple on White (JPG)", desc: ICON, tags: ["icon", "dp", "square", "purple", "on-white", "jpg"], sourceFile: "Square (DP-Icon)/JPG/Aspora icon purple on white.jpg" },
  { title: "Aspora Icon — White on Purple (JPG)", desc: ICON, tags: ["icon", "dp", "square", "white", "on-purple", "jpg"], sourceFile: "Square (DP-Icon)/JPG/Aspora icon white on purple.jpg" },
  { title: "Aspora Icon — Purple on White (PNG)", desc: ICON, tags: ["icon", "dp", "square", "purple", "on-white", "png"], sourceFile: "Square (DP-Icon)/PNG/Aspora icon purple on white.png" },
  { title: "Aspora Icon — White on Purple (PNG)", desc: ICON, tags: ["icon", "dp", "square", "white", "on-purple", "png"], sourceFile: "Square (DP-Icon)/PNG/Aspora icon white on purple.png" },
  { title: "Aspora Icon — Purple on White (SVG)", desc: ICON, tags: ["icon", "dp", "square", "purple", "on-white", "svg", "vector"], sourceFile: "Square (DP-Icon)/SVG (Vector)/Aspora icon purple on white.svg" },
  { title: "Aspora Icon — White on Purple (SVG)", desc: ICON, tags: ["icon", "dp", "square", "white", "on-purple", "svg", "vector"], sourceFile: "Square (DP-Icon)/SVG (Vector)/Aspora icon white on purple.svg" },
].map((a) => ({
  title: a.title,
  slug: "brand-logos",
  type: "graphic",
  pod: "general",
  platform: "all",
  creatorType: "any",
  description: `${a.desc} Source file: ${a.sourceFile}`,
  tags: a.tags,
  sourceFile: a.sourceFile,
}));
