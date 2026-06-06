// Remittance app-screen library — mirrors the Figma "Remittance" board:
//   • "Adding account"     → the Add-recipient flow
//   • "Transferring money" → the Send-money flow
// All screens live under "App Images & Videos > Images" (slug: app-images),
// with pod "remittance". The sub-flow + step live in tags so they stay
// filterable. Media is attached later via the admin uploader, so these start
// as metadata-only records (no fileKey yet).
export const remittanceScreens = [
  // ── Adding account · Add-recipient flow ───────────────────────────────
  {
    title: "Add recipient — Select delivery method",
    slug: "app-images",
    type: "image",
    pod: "remittance",
    description:
      "First step of adding a recipient: choose how the money is delivered — bank account, mobile wallet or cash pickup — each option showing its delivery fee and transfer time.",
    tags: ["remittance", "add-recipient", "delivery-method", "screen"],
  },
  {
    title: "Add recipient — Who will receive the money",
    slug: "app-images",
    type: "image",
    pod: "remittance",
    description:
      "Pick who the transfer is for: yourself, someone else, or a business.",
    tags: ["remittance", "add-recipient", "recipient-type", "screen"],
  },
  {
    title: "Add recipient — Select recipient's bank",
    slug: "app-images",
    type: "image",
    pod: "remittance",
    description:
      "Searchable list of recipient banks (e.g. Asia United Bank, Philippine Business Bank, BPI, UnionBank) to route the transfer to.",
    tags: ["remittance", "add-recipient", "bank-select", "screen"],
  },
  {
    title: "Add recipient — Enter bank details",
    slug: "app-images",
    type: "image",
    pod: "remittance",
    description:
      "Enter the recipient's bank account number, with paste support and account-number validation before continuing.",
    tags: ["remittance", "add-recipient", "bank-details", "screen"],
  },
  {
    title: "Add recipient — Enter recipient details",
    slug: "app-images",
    type: "image",
    pod: "remittance",
    description:
      "Capture the recipient's full name, nationality, address, contact number and an optional nickname to save them.",
    tags: ["remittance", "add-recipient", "recipient-details", "screen"],
  },

  // ── Transferring money · Send-money flow ──────────────────────────────
  {
    title: "Send money — Home & first payment",
    slug: "app-images",
    type: "image",
    pod: "remittance",
    description:
      "First-time home screen that welcomes the user and prompts their first payment, alongside paying contacts and bill & recharge.",
    tags: ["remittance", "send-money", "home", "first-time", "screen"],
  },
  {
    title: "Send money — Fast-track guarantee intro",
    slug: "app-images",
    type: "image",
    pod: "remittance",
    description:
      "First-time intro to fast-track transfers — 'Faster transfers, when it matters most' — explaining money delivered in minutes.",
    tags: ["remittance", "send-money", "fast-track", "intro", "screen"],
  },
  {
    title: "Send money — Amount entry",
    slug: "app-images",
    type: "image",
    pod: "remittance",
    description:
      "Enter the send amount with live USD→INR conversion, the locked-in rate and Aspora cash reward (fast-track-unavailable state).",
    tags: ["remittance", "send-money", "amount-entry", "screen"],
  },
  {
    title: "Send money — Fee breakdown",
    slug: "app-images",
    type: "image",
    pod: "remittance",
    description:
      "Bottom sheet explaining how fees are calculated — platform fee, fast-track fee and total — for full transparency before sending.",
    tags: ["remittance", "send-money", "fees", "bottom-sheet", "screen"],
  },
  {
    title: "Send money — Provider comparison",
    slug: "app-images",
    type: "image",
    pod: "remittance",
    description:
      "Compares what the recipient gets across Aspora, Botim, Remitly and Wise, showing Aspora as the best value.",
    tags: ["remittance", "send-money", "comparison", "screen"],
  },
  {
    title: "Send money — Purpose of transfer",
    slug: "app-images",
    type: "image",
    pod: "remittance",
    description:
      "Select the regulatory purpose of the transfer — family support, investment, education, wedding, medical, rent, expenses or other.",
    tags: ["remittance", "send-money", "purpose", "screen"],
  },
  {
    title: "Send money — Aspora Guarantee",
    slug: "app-images",
    type: "image",
    pod: "remittance",
    description:
      "The Aspora Guarantee promise — on-time transfer or $50 cash back — reassuring the user right before they pay.",
    tags: ["remittance", "send-money", "guarantee", "screen"],
  },
  {
    title: "Send money — Review transfer",
    slug: "app-images",
    type: "image",
    pod: "remittance",
    description:
      "Final review summarising the amount, rate, fees, transfer time and payment method before the transfer is sent.",
    tags: ["remittance", "send-money", "review", "screen"],
  },
  {
    title: "Send money — Confirming payment",
    slug: "app-images",
    type: "image",
    pod: "remittance",
    description:
      "Processing state shown while the payment is being confirmed — can take up to 30 seconds.",
    tags: ["remittance", "send-money", "confirming", "screen"],
  },
  {
    title: "Send money — Payment received",
    slug: "app-images",
    type: "image",
    pod: "remittance",
    description:
      "Success state confirming the payment was received, with the expected credit time and savings vs standard banks.",
    tags: ["remittance", "send-money", "success", "screen"],
  },
  {
    title: "Send money — Payment received (Aspora Guarantee)",
    slug: "app-images",
    type: "image",
    pod: "remittance",
    description:
      "Payment-received success variant backed by the Aspora Guarantee shield, reinforcing trust on completion.",
    tags: ["remittance", "send-money", "success", "guarantee", "screen"],
  },
  {
    title: "Send money — Transfer completed",
    slug: "app-images",
    type: "image",
    pod: "remittance",
    description:
      "Post-completion transfer details — 'Transfer completed in 1h 20m' — with the delivery timeline and a downloadable receipt.",
    tags: ["remittance", "send-money", "completed", "receipt", "screen"],
  },
];
