// NRI Banking app screens, transcribed from the Figma boards and grouped into
// the same sub-flows the designer drew (each board header = one `section`).
//
// Two macro-journeys:
//   • Account opening — pre-journey → the-journey → kyc → tax → nominee → review-confirm
//   • Account management — account-home → account-details → adding-money → statement → mpin
//
// All live under pod "nri", category "app-images" (slug), type "image". The
// section id is also emitted as a tag so prisma/set-sections.js can re-derive it.

const screens = [
  // ── Pre-journey ─────────────────────────────────────────────────────────
  { section: "pre-journey", title: "NRE/NRO onboarding — Welcome", description: "Entry screen for opening an NRE/NRO account: up to 7% on savings, trusted by 1M+ customers and protected deposits, powered by Shivalik Small Finance Bank. CTA to create an account.", tags: ["onboarding", "nre", "nro", "intro", "welcome"] },
  { section: "pre-journey", title: "NRE/NRO onboarding — Aspora × Shivalik Bank", description: "Explains how the account works in partnership with Shivalik Bank — manage money day-to-day with Aspora while deposits sit with an RBI-regulated bank.", tags: ["onboarding", "partnership", "shivalik", "how-it-works"] },
  { section: "pre-journey", title: "What you'll need to get started", description: "Pre-application checklist of global details (passport, UK share code) and account details (PAN, digital signature). Progress is saved as you go.", tags: ["onboarding", "checklist", "requirements", "documents"] },
  { section: "pre-journey", title: "A secure home for your money", description: "Security & trust overview: money protected, data kept private and encrypted, backed by a real RBI-regulated bank, with support whenever needed.", tags: ["onboarding", "security", "trust", "encryption"] },

  // ── The Journey ─────────────────────────────────────────────────────────
  { section: "the-journey", title: "Your journey — Setup overview", description: "Personalised journey intro listing the five steps ahead: your life in the UK, identity, tax details, verify & protect, and making it official. CTA 'Let's go'.", tags: ["journey", "overview", "steps", "lets-go"] },
  { section: "the-journey", title: "Your journey — Mumbai to Harrow timeline", description: "Visual journey timeline from Mumbai to Harrow with each milestone laid out, framing the full account-opening path before you begin.", tags: ["journey", "timeline", "milestones"] },

  // ── KYC ─────────────────────────────────────────────────────────────────
  { section: "kyc", title: "KYC — Start your application", description: "KYC kick-off screen ('Evening, Sophia…') recapping the steps, with a 'Get started' CTA to begin the know-your-customer flow.", tags: ["kyc", "start", "get-started"] },
  { section: "kyc", title: "KYC — UK home address", description: "Capture the applicant's UK home address with postcode lookup and address confirmation before continuing.", tags: ["kyc", "address", "uk", "home-address"] },
  { section: "kyc", title: "KYC — Marital status", description: "Single-select marital status step: Single, Married or Divorced.", tags: ["kyc", "marital-status", "personal-details"] },
  { section: "kyc", title: "KYC — What you do for work", description: "Employment status selection: full-time employee, self-employed, student, retired, homemaker, government employee or other.", tags: ["kyc", "employment", "occupation", "work"] },
  { section: "kyc", title: "KYC — Annual income", description: "Capture annual income before taxes via a single amount field.", tags: ["kyc", "income", "annual-income", "amount-entry"] },
  { section: "kyc", title: "KYC — Highest level of education", description: "Education level selection: undergraduate, graduate, post-graduate or PhD.", tags: ["kyc", "education", "qualification"] },

  // ── Tax ───────────────────────────────────────────────────────────────────
  { section: "tax", title: "Tax — Verify your identity", description: "Identity verification hub: passport, selfie, UK share code and proof of address, each shared securely with Shivalik Bank to open the account.", tags: ["tax", "verify-identity", "passport", "share-code"] },
  { section: "tax", title: "Tax — Your UK tax details", description: "Enter the UK tax identification number (NI / UTR) used for tax residency reporting.", tags: ["tax", "uk", "tax-id", "tin"] },
  { section: "tax", title: "Tax — Other countries of tax residency", description: "Asks whether the applicant pays tax in any country other than the UK or India, with a searchable country picker.", tags: ["tax", "residency", "fatca", "crs", "countries"] },

  // ── Nominee ───────────────────────────────────────────────────────────────
  { section: "nominee", title: "Nominee — Set up your nominee", description: "Introduces nominees: why to add one (funds released to them directly, simpler claims), with options to set up now or do it later.", tags: ["nominee", "intro", "setup"] },
  { section: "nominee", title: "Nominee — Nominee details", description: "Capture the nominee's full name, date of birth and relationship to the applicant (parent, spouse, sibling, friend, child, other).", tags: ["nominee", "details", "relationship"] },

  // ── Review and Confirm ────────────────────────────────────────────────────
  { section: "review-confirm", title: "Review & Confirm — One final confirmation", description: "Read-only summary of the applicant's passport and personal details for a last check before declarations.", tags: ["review", "confirm", "summary", "passport-details"] },
  { section: "review-confirm", title: "Review & Confirm — Declarations & e-sign", description: "Declarations to accept (accuracy, FATCA/CRS, not a PEP, virtual debit card consent) with documents ready to e-sign. CTA 'Proceed to e-sign'.", tags: ["review", "declarations", "e-sign", "consent"] },
  { section: "review-confirm", title: "Review & Confirm — Account sorted", description: "Completion screen: the Mumbai-to-Harrow journey timeline fully checked off confirming the NRE/NRO account is sorted. CTA 'See your account'.", tags: ["review", "complete", "timeline", "success"] },

  // ── Account home & Switching ────────────────────────────────────────────
  { section: "account-home", title: "Account home — Awaiting first deposit", description: "NRE account home with a ₹0 balance, 'waiting for your first deposit' prompt and guidance to make the first deposit. CTA to add money.", tags: ["account-home", "empty-state", "first-deposit", "nre"] },
  { section: "account-home", title: "Account home — Funded balance", description: "NRE account home showing a funded balance earning 7%, with send-money / add-money actions and a recent activities list.", tags: ["account-home", "balance", "activities", "earning"] },
  { section: "account-home", title: "Switch account — NRE / NRO", description: "Account switcher bottom sheet to move between the NRE and NRO accounts, each with its own balance.", tags: ["account-home", "switch-account", "nre", "nro"] },

  // ── Account Details ───────────────────────────────────────────────────────
  { section: "account-details", title: "Account details — Domestic (India)", description: "Domestic account details for receiving INR within India: account holder name, account number, IFSC and bank branch, with share & add-money actions.", tags: ["account-details", "domestic", "ifsc", "india"] },
  { section: "account-details", title: "Account details — International (SWIFT)", description: "International account details for inward remittance: IBAN, SWIFT/BIC, correspondent bank and address, with share & add-money actions.", tags: ["account-details", "international", "swift", "iban"] },

  // ── Adding Money (add-money via payment gateway) ──────────────────────────
  { section: "adding-money", title: "Add money — Amount entry", description: "Add-money amount keypad starting at ₹0, with live FX rate comparison to fund the NRE account.", tags: ["adding-money", "add-money", "amount-entry", "fx"] },
  { section: "adding-money", title: "Add money — Funding & fees", description: "Add-money summary with the entered amount, funding source (Apple Pay), fees, fast-track option and credited amount before continuing.", tags: ["adding-money", "add-money", "fees", "funding-source"] },
  { section: "adding-money", title: "Add money — Review & confirm transfer", description: "Review screen for the transfer: amount, funding account, payment method and ETA, confirmed with a swipe-to-pay control.", tags: ["adding-money", "add-money", "review", "swipe-to-confirm"] },
  { section: "adding-money", title: "Add money — Processing payment", description: "Interstitial confirming the payment amount while the transfer is securely processed at the gateway.", tags: ["adding-money", "add-money", "processing", "interstitial"] },
  { section: "adding-money", title: "Add money — Payment receipt", description: "Stamped 'PAID' receipt confirming the money was received, with amount, destination account and payment method.", tags: ["adding-money", "add-money", "receipt", "paid"] },
  { section: "adding-money", title: "Add money — Payment received", description: "Success screen: 'we've received your payment, transfer initiated', with internal compliance checks passed and a View details CTA.", tags: ["adding-money", "add-money", "success", "transfer-initiated"] },

  // ── Sending Money (send to a recipient, authorised with MPIN) ─────────────
  { section: "sending-money", title: "Sending money — Amount entry", description: "Send-money keypad to enter the amount (e.g. ₹5,000) from the NRE account before continuing.", tags: ["sending-money", "amount-entry", "send"] },
  { section: "sending-money", title: "Sending money — Review & confirm transfer", description: "Review the outgoing transfer: amount, source NRE account, recipient (Rajan · HDFC), preferred network (IMPS) and amount the recipient gets, confirmed with swipe-to-pay.", tags: ["sending-money", "review", "imps", "swipe-to-confirm"] },
  { section: "sending-money", title: "Sending money — Transfer success", description: "Success confirmation that funds were transferred, with amount, from and to accounts and a View details CTA.", tags: ["sending-money", "success", "transferred"] },
  { section: "sending-money", title: "Sending money — Confirming at gateway", description: "Interstitial showing the amount and recipient while the user is redirected to the payment gateway to authorise the transfer.", tags: ["sending-money", "gateway", "interstitial"] },
  { section: "sending-money", title: "Sending money — Enter MPIN", description: "Security step: enter the Aspora MPIN to verify and authorise the transaction.", tags: ["sending-money", "mpin", "security"] },
  { section: "sending-money", title: "Sending money — MPIN verified", description: "MPIN-verified confirmation before being taken to the payment gateway.", tags: ["sending-money", "mpin-verified", "security"] },
  { section: "sending-money", title: "Sending money — Funds transferred", description: "Final success screen confirming funds have successfully been transferred, with the transfer summary and a View details CTA.", tags: ["sending-money", "success", "completed"] },

  // ── Account Statement ─────────────────────────────────────────────────────
  { section: "statement", title: "Statement — Quick download by year", description: "Account statement screen with quick downloads for the last and current financial years.", tags: ["statement", "download", "financial-year"] },
  { section: "statement", title: "Statement — Custom date range", description: "Generate a statement for a custom date range with From/To date pickers and a download CTA.", tags: ["statement", "download", "custom-range", "date-picker"] },

  // ── MPIN ────────────────────────────────────────────────────────────────
  { section: "mpin", title: "MPIN — Enter to view card details", description: "MPIN entry screen to unlock and view Aspora debit card details.", tags: ["mpin", "enter", "debit-card", "security"] },
  { section: "mpin", title: "MPIN — Entry (filled state)", description: "MPIN entry keypad mid-input, showing the dots filling as the PIN is typed.", tags: ["mpin", "enter", "keypad", "security"] },
  { section: "mpin", title: "MPIN — Set & confirm new PIN", description: "Set a new MPIN and re-enter it to confirm, with guidance to avoid sequential or birthday PINs.", tags: ["mpin", "set", "confirm", "security"] },
];

export const nriScreens = screens.map((s) => ({
  title: s.title,
  slug: "app-images",
  type: "image",
  pod: "nri",
  section: s.section,
  platform: "all",
  creatorType: "any",
  description: s.description,
  // section id doubles as a tag so the backfill can re-derive section from tags.
  tags: [...new Set([s.section, ...s.tags, "nri", "screen"])],
}));
