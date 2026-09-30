# Prompts & Outputs Log

A running log of prompts given to AI assistants on this project and a summary of what was produced.

---

## 2026-09-22 — Project scaffold

**Prompt:** Set up a Next.js App Router project with Tailwind CSS, framer-motion, and lucide-react in the current directory without overwriting existing files (.env.local, lib/supabaseClient.js, or public/). Create a prompts-and-outputs.md log file. Configure Tailwind theme colors matching the logo at public/images/logo.png: dark obsidian background (#080c10), electric teal primary accent (#00f2fe), and metallic silver secondary borders (#94a3b8).

**Output:**
- Scaffolded Next.js 16 App Router structure (`app/layout.js`, `app/page.js`, `app/globals.css`) alongside the existing `.env.local`, `lib/supabaseClient.js`, and `public/` — none of which were modified.
- Added `next`, `react`, `react-dom`, `framer-motion`, `lucide-react` to `package.json` dependencies, and `tailwindcss`, `@tailwindcss/postcss`, `eslint`, `eslint-config-next` to devDependencies, preserving the existing `@supabase/supabase-js` dependency.
- Configured Tailwind v4 theme tokens in `app/globals.css` via `@theme`: `--color-obsidian: #080c10`, `--color-teal: #00f2fe`, `--color-silver: #94a3b8` (usable as `bg-obsidian`, `text-teal`, `border-silver`, etc.).
- Added `next.config.mjs`, `postcss.config.mjs`, `eslint.config.mjs`, `jsconfig.json` (`@/*` import alias), and `.gitignore`.
- Home page (`app/page.js`) demonstrates the wiring: framer-motion fade/slide-in animation, a lucide-react icon, and the new theme colors.
- Pinned `eslint` to `^9.39.5` after `eslint@10.11.0` (npm's "latest" at the time) crashed against `eslint-config-next@16.3.6` with an internal scope-manager error; `eslint-config-next`'s flat config is consumed directly (no `@eslint/eslintrc`/`FlatCompat` needed on this version).

---

## 2026-09-22 — Navbar and Footer

**Prompt:** Create `components/Navbar.jsx` and `components/Footer.jsx` using `lucide-react` icons and Framer Motion. Integrate `public/images/logo.png` in the header alongside navigation links for "Models", "Compare", "Our Story", "Founders", and "FAQ", plus prominent CTA buttons for "Book Test Drive" and "Waitlist". Update `app/layout.js` to include the sticky Navbar and Footer with our obsidian background theme (#080c10). Log this step in `prompts-and-outputs.md` and ensure `npm run build` passes.

**Output:**
- Added `components/Navbar.jsx`: sticky header (transparent → blurred obsidian on scroll) with the logo emblem cropped tightly from `public/images/logo.png` (the full square lockup is illegible at nav scale), the five nav links, and two CTAs — filled teal "Book Test Drive" (primary) and outlined "Waitlist" (secondary). Hover/focus on a nav link slides a teal underline via a framer-motion `layoutId`, echoing the glowing road-line motif under the wordmark in the logo. Below `lg`, a hamburger (`Menu`/`X` from lucide-react) opens an animated `AnimatePresence` panel with stacked links and full-width CTAs.
- Added `components/Footer.jsx`: brand block (logo + one-line mission copy), an "Explore" column reusing the same nav links, and a "Get in Touch" column with lucide-react `MapPin`/`Mail`/`Phone` icons — this lucide-react version (1.47.0) ships no social/brand icons, so contact details stood in for a social row. Bottom bar has the copyright line and a "Back to top" link with a framer-motion hover/tap lift.
- Added `lib/navigation.js` exporting the shared `navLinks` array used by both components.
- Updated `app/layout.js` to load `Space_Grotesk` via `next/font/google`, wrap the page in a flex column (`Navbar` → `main` → `Footer`, `flex-1` on `main` so the footer sits at the bottom of short pages) on the obsidian background.
- Verified visually with a headless-Chromium (Playwright) run against the dev server: logo crop, nav underline hover state, mobile menu, and footer all render as intended. `npm run lint` and `npm run build` both pass.

---

## 2026-09-22 — Hero section

**Prompt:** Create `components/Hero.jsx` and integrate it into `app/page.js`. The Hero must feature an availability badge, headline/tagline, primary/secondary CTAs, an animated L6/L7 visual showcase using images from `public/images/cars/` and `public/images/L6/` / `L7/`, and value-proposition highlights (low operating cost, easy urban parking, local after-sales guarantee by AVC-SM & BetaSped). Dark automotive aesthetic, obsidian background, teal accents. Log this step and verify `npm run build` passes.

**Note:** `public/images/L6/` and `public/images/L7/` don't exist yet — only `public/images/cars/delivered.jpg` and two unlabeled product photos under `public/images/romania-trip/` (real Linktour-badged vehicles, but no visible model number to tell which unit is the L6 vs. the L7). Asked the user how to proceed; they'll add correctly-labeled photos into `public/images/L6/` and `public/images/L7/` themselves.

**Output:**
- Added `components/Hero.jsx`: availability badge ("🟢 Demo Vehicles Arrived in Macedonia — Reserve Your Test Drive Today"), headline "Electric Mobility Made Practical" / tagline "Compact outside, practical inside. Drive more, spend less.", primary CTA "Book Test Drive" (filled teal) and secondary "Explore L6 & L7" (outlined, linking to `/models`), three value-prop highlights (`PiggyBank` "Low operating cost", `CircleParking` "Easy urban parking", `ShieldCheck` "Local after-sales guarantee" crediting AVC-SM & BetaSped), and an L6/L7 showcase panel with a framer-motion tab switcher (shared `layoutId` pill, matching the nav's underline pattern) that cross-fades between `/images/L6/hero.jpg` and `/images/L7/hero.jpg`.
- Because those files don't exist yet, the showcase's `<Image onError>` falls back to a styled placeholder (car icon + model name + "Photos coming soon") instead of a broken-image icon — drop `hero.jpg` (or update the `src` in `components/Hero.jsx`) into `public/images/L6/` and `public/images/L7/` and the real photos will render automatically, no code changes needed.
- Whole-section entrance is one staggered reveal (badge → headline → tagline → CTAs → highlights); the only other motion is the tab cross-fade, which responds to a click rather than firing on scroll.
- Rewired `app/page.js` to render `<Hero />` directly (removed the placeholder card and its redundant nested `<main>`, since `app/layout.js` already provides one).
- Verified with headless-Chromium (Playwright): entrance animation, L6→L7 tab switch (including the fallback-state settle), and mobile layout all render as intended. `npm run lint` and `npm run build` both pass.

---

## 2026-09-22 — Model showcase, comparison matrix, and fuel-savings calculator

**Prompt:** Create `components/ModelShowcase.jsx` and `components/ModelComparison.jsx` and integrate them into `app/page.js`: detailed L6/L7 spec sheets (battery capacity, driving range, motor power, top speed, quadricycle classification), image galleries from `public/images/L6/` / `L7/` with graceful fallback, an interactive side-by-side comparison matrix, an interactive fuel-savings calculator (adjustable daily commuting distance → monthly/yearly savings vs. petrol), and "Book Test Drive" / "Reserve / Pre-Order" CTAs on each model card. Dark theme, teal accents, silver borders, smooth Framer Motion tab transitions. Log this step and verify `npm run build` passes.

**Note:** Checked `AVC-Betasped-Auravia.docx` and `roadmap.docx` for real spec numbers before writing anything. They confirm the classification (L6 = L6e quadricycle, L7 = L7e quadricycle, "L7 has larger battery, higher top speed, longer range") but contain no actual battery kWh / range km / motor kW / top speed figures for either model. Asked the user rather than inventing numbers for a real spec sheet; they chose to ship with clearly-labeled placeholders now (same pattern as the missing L6/L7 photos), real figures to be swapped in later.

**Output:**
- Added `lib/models.js`: shared data source for both components — `models` (id, name, tagline, gallery image paths under `/images/L6/` and `/images/L7/`, and a `specs` object per model) and `specFields` (the ordered field list with an icon per row). Quadricycle classification holds the real "L6e quadricycle" / "L7e quadricycle" values; every other spec field (battery, range, motor power, top speed, charging time, dimensions) is the literal string `"Coming soon"`, styled in muted italic wherever it's rendered so it reads as an honest placeholder, not fabricated data.
- Added `components/ModelShowcase.jsx`: a framer-motion pill tab switcher (shared `layoutId`, same pattern as the nav and Hero) swaps between full L6 and L7 cards — spec sheet + "Book Test Drive" (→ `/test-drive?model=`) and "Reserve / Pre-Order" (→ `/reserve?model=`) CTAs on one side, an image gallery (main viewer + 4 thumbnails) on the other. Each gallery image expects a file at `/images/L6/{hero,side,interior,rear}.jpg` (same for L7) and falls back per-image to a styled "Photo coming soon" tile via `onError`, exactly like the Hero showcase — drop matching files into `public/images/L6/` and `public/images/L7/` and they'll render automatically.
- Added `components/ModelComparison.jsx`: a side-by-side spec matrix (one row per `specFields` entry) with a hover-driven column highlight — hovering either model's header or any of its cells tints that whole column — plus a Fuel-Savings Calculator below it: a slider for daily commuting distance (5–150 km) drives live monthly/yearly savings figures, with an expandable "Adjust cost assumptions" panel exposing the underlying EV consumption, electricity price, petrol consumption, and petrol price as editable inputs, captioned "Defaults are illustrative estimates, not confirmed Linktour figures" so nobody mistakes the calculator's assumptions for verified pricing.
- Updated `app/page.js` to render `<Hero />` → `<ModelShowcase />` → `<ModelComparison />`.
- Fixed an `eslint` `react-hooks/set-state-in-effect` error in `ModelShowcase` by resetting the gallery index during render (comparing `activeId` against a `renderedId` state) instead of in a `useEffect`, per the React docs pattern for derived state resets.
- Verified with headless-Chromium (Playwright): tab switching in both the showcase and its gallery thumbnails, the comparison table's column hover highlight, and the calculator's slider + assumptions panel (checked at 40 km/day and 100 km/day) all behave as intended, on both desktop and mobile viewports. `npm run lint` and `npm run build` both pass.

---

## 2026-09-22 — Storyline (Our Journey) and Founders sections

**Prompt:** Create `components/Storyline.jsx` ("Our Journey" — a 3-milestone interactive timeline: China Partnership, Romania Transit, Macedonia Arrival, images from `public/images/china-agreement/`, `romania-trip/`, and `cars/`, graceful fallback if missing) and `components/Founders.jsx` ("The Powerhouse Behind Auravia" — AVC-SM and BetaSped joint venture, focused on reassuring customers about local technical support and parts). Wire both into `app/page.js`. Dark theme, teal accents, silver borders, Framer Motion scroll animations. Log this step and verify `npm run build` passes.

**Note:** Unlike the L6/L7 folders, `public/images/china-agreement/`, `romania-trip/`, and `cars/` already contain real photos — reviewed all of them first (including two I hadn't opened yet, `44606eaa...jpeg` and `f4b0bc4c...jpeg`, which turned out to be the best shot: the delegation at the Linktour factory entrance under a "Welcome AURAVIA Electric Mobility to the LINKTOUR Factory!" banner) and picked the most representative ones per milestone instead of guessing. No new questions needed this round.

**Output:**
- Added `lib/milestones.js`: three milestones, each with a title, a description grounded in `roadmap.docx` / `AVC-Betasped-Auravia.docx` content (no invented dates — the docs don't give exact ones, so none are shown), and real image paths: China → `china-agreement/f4b0bc4c...jpeg` (factory-entrance group photo), `avc1.jpeg`, `betasped.jpeg`; Romania → both `romania-trip/*.JPG` showroom photos; Macedonia → `cars/delivered.jpg`.
- Added `components/Storyline.jsx`: a vertical timeline (numbered step markers on a connecting line — justified here since the content genuinely is a sequence) where each milestone scroll-reveals independently (`whileInView`, staggered) and carries its own small gallery (main image + thumbnails, click to switch) reusing the same per-image `onError` fallback pattern as the model galleries — so if a photo is ever moved or removed, it degrades to a "Photo coming soon" tile instead of a broken-image icon. The single-image Macedonia milestone correctly renders without a thumbnail row.
- Added `components/Founders.jsx`: two symmetric cards (AVC-SM CO., LTD. — 24+ Years, BetaSped — 30+ Years) each with a capability list (battery diagnostics & cell balancing, technical repair, local warranty support for AVC-SM; international logistics & customs, warehousing, 30+ years of supply-chain reliability for BetaSped), a `Handshake` icon connecting the two cards in the seam between them (desktop only), and a closing reassurance banner: "Every Auravia vehicle is backed by AVC-SM's battery diagnostics expertise and BetaSped's logistics network — so genuine parts and qualified service are always close to home in North Macedonia."
- Updated `app/page.js` to render `<Hero />` → `<ModelShowcase />` → `<ModelComparison />` → `<Storyline />` → `<Founders />`, matching the section order in `roadmap.docx`'s own site outline.
- Verified with headless-Chromium (Playwright) on desktop and mobile: all three milestone galleries render their real photos, thumbnail switching works, scroll-reveal animations fire, and the Founders cards (with the handshake connector correctly hidden on mobile) render as intended. `npm run lint` and `npm run build` both pass.

---

## 2026-09-22 — Booking modals wired to Supabase

**Prompt:** Create modal components (`components/TestDriveModal.jsx`, `components/WaitlistModal.jsx`, `components/ReserveModal.jsx`, or a unified `components/BookingModal.jsx`) wired to Supabase via `lib/supabaseClient.js`: a Test Drive modal inserting into `test_drives` (full name, email, phone, model preference, preferred date, time slot, customer type) and a Waitlist/Reserve modal inserting into `waitlist` (full name, email, phone, model interest, color preference, intent type). Wire every "Book Test Drive" / "Reserve / Pre-Order" / "Waitlist" button across `Navbar.jsx`, `Hero.jsx`, `ModelShowcase.jsx`, and `Footer.jsx` to open the right modal. Dark theme, teal glow border, Framer Motion entrance/exit, accessible close, loading state, success/error banners. Log this step and verify `npm run build` passes.

**Architecture decision:** Went with the unified `components/BookingModal.jsx` manager rather than three separate files. Reasoning: (1) the trigger buttons live in four sibling components split across `app/layout.js` (Navbar, Footer) and `app/page.js` (Hero, ModelShowcase) — none of them are ancestors of each other, so opening a shared modal requires lifting state into a React Context regardless of how many modal files exist; (2) the Waitlist and Reserve/Pre-Order forms are the same fields against the same table, differing only in which `intent_type` is pre-selected and the modal heading, so writing them as one parameterized form avoids duplicating a whole form for a one-field difference.

**Connected to the real Supabase project and found — and fixed — a real bug before writing any UI:**
- Authenticated the Supabase MCP server (user completed the OAuth flow) and located the project (`auravia-project`, ref `kuxhweeliidpbkzeexmx`, matching `.env.local`'s URL).
- `list_tables` showed `test_drives` and `waitlist` **already exist** with almost exactly the requested schema (plus a third, unrelated `inquiries` table) — no migration needed for structure. Checked `pg_policies`: both tables have an `anon`-scoped `INSERT`-only RLS policy (`with_check: true`) and no `SELECT` policy for `anon` — correct for public forms holding PII, but it means the client must not chain `.select()` after insert (PostgREST can't return rows the role can't `SELECT`, even though the `INSERT` itself would succeed) — `BookingModal.jsx`'s inserts rely on `error` alone, not the returned row.
- Ran `get_advisors` (security): found one pre-existing, unrelated issue — a `public.rls_auto_enable()` function is `SECURITY DEFINER` and callable by `anon`/`authenticated` via RPC. Not something this task touched or created; flagging it for the user to look at separately.
- Built the modals, then **actually submitted both forms through the real UI with Playwright** rather than trusting the code — both failed with `401`. Pulled `edge_logs` and curled the REST endpoint directly with the anon key, which returned Postgres error `42501: permission denied for table waitlist`, with Supabase's own hint: `GRANT INSERT ON public.waitlist TO anon`. Queried `information_schema.role_table_grants` and confirmed: `anon` had `REFERENCES`/`TRIGGER`/`TRUNCATE` on both tables but never `INSERT` — the RLS policy existed, but the underlying Postgres grant didn't (exactly the "exposing a table to the Data API" gotcha the Supabase skill calls out — RLS and table grants are separate layers). Applied a migration (`grant_anon_insert_test_drives_waitlist`) granting only `INSERT` — not `SELECT`/`UPDATE`/`DELETE` — to `anon` on both tables, matching the least-privilege RLS posture already in place. Re-tested: `201 Created`, then re-ran the full Playwright flow through the actual modals — both succeeded, rows verified in the database, then deleted (test data doesn't belong in the real tables).

**Output:**
- Added `lib/bookingModalContext.jsx`: a `BookingModalProvider` + `useBookingModal()` hook exposing `{ type, prefill, openModal, closeModal }`, mounted once in `app/layout.js` so any component in the tree can open a modal.
- Added `components/BookingModal.jsx`: the modal shell (backdrop + panel, `AnimatePresence` fade/scale entrance-exit, teal glow border via `shadow-[...var(--color-teal)]`, `role="dialog"`/`aria-modal`/`aria-labelledby`, closes on Escape, backdrop click, or the close button, locks body scroll while open) plus two internal forms:
  - `TestDriveForm` → `test_drives` (full name, email, phone, model preference, preferred date — min-dated to today, time slot, customer type), reused for the `test-drive` trigger everywhere.
  - `WaitlistForm` → `waitlist` (full name, email, phone, model interest, optional color preference, intent type), parameterized by an `intent` prop so the `waitlist` trigger defaults to "Join the waitlist" and the `reserve` trigger defaults to "Place a pre-order deposit" — both editable, both hit the same table.
  - Both forms track `idle` / `submitting` / `success` / `error` state, disable/spin the submit button while submitting, and show a dismissible success or error banner in place of the form.
- Updated `app/layout.js` to wrap the app in `BookingModalProvider` and mount `<BookingModal />` once.
- Rewired every booking trigger to call `openModal(type, { model })`: `Navbar.jsx` (desktop + mobile menu "Waitlist"/"Book Test Drive"), `Hero.jsx` ("Book Test Drive"), `ModelShowcase.jsx` ("Book Test Drive"/"Reserve / Pre-Order", prefilled with whichever model tab is active), and `Footer.jsx` — which had no booking buttons before this — now has "Book Test Drive"/"Waitlist" under the brand blurb.
- `npm run lint` and `npm run build` both pass.

---

## 2026-09-22 — FAQ, "Ask a Specialist," and the AI ChatBot

**Prompt:** Create `components/FAQ.jsx` (categorized accordion covering Charging & Range, Licensing & Quadricycles, and Local Service & Warranty, grounded in `AVC-Betasped-Auravia.docx`, plus an "Ask a Specialist" form inserting into Supabase `inquiries`), `components/ChatBot.jsx` + `app/api/chat/route.js` (floating chat bubble, API route with system instructions grounded in the same doc, quick-action buttons, graceful mock fallback when no `OPENAI_API_KEY`/`ANTHROPIC_API_KEY` is set), wire into `app/page.js` and `app/layout.js`. Dark theme, teal accents, silver borders, Framer Motion. Log this step and verify `npm run build` passes.

**Note on content honesty:** Same policy as the spec sheets and the fuel-savings calculator — the FAQ answers and the chatbot's system prompt state what's actually documented (JV structure, L6e/L7e classification, AVC-SM's battery-diagnostics expertise, BetaSped's logistics role, standard-outlet home charging) and explicitly defer anything numeric (exact charge time, range, pricing) to "ask a specialist" rather than inventing figures. The chatbot's system prompt carries an explicit rule never to state exact specs or pricing, for the same reason.

**Found the same missing-grant issue a third time:** `inquiries` already had the correct `anon` insert-only RLS policy but — like `test_drives`/`waitlist` before the previous fix — was never actually `GRANT`ed `INSERT` for `anon` (verified via `information_schema.role_table_grants` before writing the form). Applied a migration (`grant_anon_insert_inquiries`) fixing it before testing, rather than discovering it the same way again.

**Output:**
- Added `components/FormControls.jsx`: extracted `StatusBanner`, `SubmitButton`, and the shared `inputClass`/`labelClass` out of `BookingModal.jsx` (now on its third consumer with the specialist form, which crossed the line from "acceptable duplication" to "actually share this"). `BookingModal.jsx` now imports from here instead of defining its own copies — no behavior change, verified via the same Playwright flow from last time.
- Added `components/FAQ.jsx`: three categories (`Charging & Range`, `Licensing & Quadricycles`, `Local Service & Warranty`), each a set of independently-collapsible accordion rows (`AnimatePresence` height animation, same pattern as the nav's mobile menu) revealed on scroll. Below the categories, an "Ask a Specialist" panel — full name, email, phone, message — inserts into `public.inquiries` with `inquiry_type: "FAQ - Ask a Specialist"` so these submissions are distinguishable from any other inquiry source later.
- Added `app/api/chat/route.js`: a `POST` route handler with a system prompt grounded in the AVC-Betasped doc (JV structure, L6/L7 classification, value props, local support), which never states exact specs/pricing. Provider order: `ANTHROPIC_API_KEY` (via the official `@anthropic-ai/sdk`, `claude-opus-5`, low effort — a short grounded FAQ answer doesn't need high reasoning depth) → `OPENAI_API_KEY` (plain `fetch` to the chat completions endpoint, `gpt-4o-mini` — no SDK added for a secondary/untested path) → a rule-based keyword-matched mock responder covering charging, L6-vs-L7, warranty, test-drive, and pricing questions, always returning `200` so the UI never has to distinguish "AI failed" from "no AI configured." Neither env var is set in this project right now, so the mock path is what actually runs — tested it directly and through the UI.
- Added `components/ChatBot.jsx`: a floating bottom-right bubble (`fixed z-40`, below the booking modal's `z-100`) that opens a chat panel (`AnimatePresence` scale/fade, same motion language as `BookingModal`). Three quick actions: "Compare L6 vs L7" and "Charging Info" send a canned prompt through `/api/chat`; "Book Test Drive" skips the chat entirely and calls `useBookingModal().openModal("test-drive")` directly — a real site action is more useful than an AI-generated description of one, and it reuses the modal infrastructure from last session.
- Wired `<FAQ />` into `app/page.js` (after `Founders`) and `<ChatBot />` into `app/layout.js` (inside `BookingModalProvider`, since its "Book Test Drive" quick action needs the same context as everything else).
- Caught a real bug during verification, not just a wiring check: the "Compare L6 vs L7" / "Charging Info" quick actions worked, but typing "What about pricing?" fell through to the generic fallback instead of the cost-specific answer — the mock responder's regex matched `price` but not `pricing`. Fixed (`/pric.../` instead of `/price.../`) and re-verified.
- Verified end-to-end with Playwright: FAQ accordion expand/collapse, the specialist form's real insert into `inquiries` (confirmed in the database, then deleted), the chat bubble's entrance/open/close, both quick-action paths (one hitting the mock API, one opening the real booking modal), a typed message, and mobile layout for both components. `npm run lint` and `npm run build` both pass.

---

## 2026-09-23 — Real L6/L7 specs from Linktour's product page

**Prompt:** Read `docs/linktour-specs.md`. Using the standard Alumi specs for the L6e and the Alumi Elite specs for the L7e, update `lib/models.js` — replace the "Coming soon" placeholders with real values for dimensions, power, range, top speed, and ground clearance. Make sure `components/ModelComparison.jsx` and `components/ModelShowcase.jsx` handle the new data. Log this step and verify `npm run build` passes.

**Source note:** `docs/linktour-specs.md` didn't exist in the project, so I created it from the data pulled earlier this session from https://www.linktour-auto.com/en/product/alumi. The page never says "L6"/"L7". The Alumi → L6e mapping follows from EU limits (L6e: max 45 km/h and 6 kW; the Alumi is listed at exactly that), and the Alumi Elite → L7e mapping from its 10 kW rating.

**Same content-honesty policy as before:** only published figures went in. The page gives **no top speed for the Alumi Elite**, and no battery capacity or charging time for either model, so those fields stay "Coming soon" rather than being guessed.

**Output:**
- `lib/models.js`: filled in range (120 / 180 km WMTC), motor power (6 kW · 65 N·m / 10 kW · 95 N·m), L6 top speed (45 km/h), dimensions (2685 × 1500 × 1555 / 1590 mm, with the label now "Dimensions (L × W × H)"), and added a new `groundClearance` field (140 / 130 mm; no ground clearance row existed before). Exported a `SPEC_PLACEHOLDER` constant so the components no longer each hard-code the `"Coming soon"` string they compare against.
- `components/ModelShowcase.jsx`: registered the new field's `ArrowUpFromLine` icon (an unregistered icon would have crashed the render with an undefined component), used `SPEC_PLACEHOLDER`, and right-aligned values so the longer dimensions string wraps cleanly on narrow screens.
- `components/ModelComparison.jsx`: used `SPEC_PLACEHOLDER` and made value cells `whitespace-nowrap` so the dimensions don't break mid-number (the table already scrolls horizontally on mobile).
- Verified: `npm run lint` and `npm run build` pass. Ran `next start` and confirmed the server-rendered HTML shows the new values in both components, with "Coming soon" only on the unpublished fields.
- **Follow-up to consider:** the chatbot's system prompt and mock responder (`app/api/chat/route.js`) and the FAQ still say exact range/specs aren't available. Now that some are published, those could be updated to match.

---

## 2026-09-23 — Full technical specs from Linktour's detail page

**Prompt:** Use https://www.linktour-auto.com/en/product/detail to add specs.

**Source:** That page is Linktour's "Technical Specifications" comparison of the Alumi and Alumi Elite. It fills in what the overview page left out: battery, charging, peak power, mass, and tyres. The first fetch attempts timed out (the site's CDN wasn't reachable over the default route), and a forced-IPv4 retry got the full page. Values were read straight from the page's spec table and weren't inferred.

**Output:**
- `lib/models.js`:
  - Replaced the remaining placeholders with real values: battery (7.2 / 12.96 kWh LFP) and charging time (4 h at 2 kW AC / 4.5 h at 3.3 kW AC, 0–100%).
  - Added peak power to motor power (12 / 23 kW peak alongside 6 / 10 kW rated).
  - Added three new rows: max. permissible mass (760 / 820 kg), gradeability (30% / 35%), and tyres (155/70 R13 / 155/65 R14, steel rims).
  - **L7 top speed is still "Coming soon"**: neither Linktour page publishes it, so it's the only placeholder left.
- `components/ModelShowcase.jsx`: registered the `Weight`, `Mountain`, and `CircleDot` icons for the new rows. `ModelComparison.jsx` needed no change because it renders whatever `specFields` lists.
- `docs/linktour-specs.md`: rewritten with both sources and the full table. It also includes specs not surfaced on the site (track width, RR drive, PMSM motor, drive modes, chassis/safety features) for future use.
- Verified: `npm run lint` and `npm run build` pass. `next start` renders every new value in both components, and "Coming soon" appears only once (L7 top speed in the comparison table).
- **Still open from last step:** the chatbot prompt/mock responder and the FAQ still defer range/charging questions as unpublished. Charging time and battery size are now published and could be stated there.

---

## 2026-09-23 — L7 top speed confirmed; chatbot and FAQ now state real specs

**Prompt:** Set the L7 (Alumi Elite) top speed to 90 km/h in `lib/models.js`. Update the system prompt in `app/api/chat/route.js` and the hardcoded text in `components/FAQ.jsx` to state that the L6 has a 7.2 kWh battery, 4 h charge (2 kW), and 45 km/h top speed, and the L7 a 12.96 kWh battery, 4.5 h charge (3.3 kW), and 90 km/h top speed. Remove any language saying these details are unpublished. Log this step and verify `npm run build` passes.

**Source note:** 90 km/h comes from the user and doesn't appear on either Linktour page. `lib/models.js` and `docs/linktour-specs.md` record it as confirmed by the Auravia team on 2026-09-23, so the provenance isn't lost.

**Output:**
- `lib/models.js`: L7 `topSpeed` is now `"90 km/h"`. No "Coming soon" values remain on the site.
- `app/api/chat/route.js`:
  - The system prompt now lists each model's battery, charge time and power, top speed, WMTC range, and rated/peak motor power. Range and motor power were already confirmed on Linktour's site, so they're included too.
  - The ground rule "never state specs, figures are being finalized" is now "state only the specs listed above, never invent others". Pricing is still unannounced, so the model is still told to defer pricing questions.
  - Updated the mock responder's charging and L6-vs-L7 replies to the same figures, because the mock is what actually runs without an API key.
- `components/FAQ.jsx`: rewrote the three answers that deferred to "ask our team": charge time, range (120 / 180 km WMTC, plus a note that real-world range varies), and speed limits (45 km/h, the L6e category limit, / 90 km/h).
- Searched `app/`, `components/`, and `lib/` for remaining "finalized"/"latest figures"/"Coming soon" wording. Only the pricing reply remains, and it's accurate.
- Verified: `npm run lint` and `npm run build` pass. On `next start`, `/api/chat` returns the new figures for charging and comparison questions and still defers pricing, and the page renders 90 km/h with no "Coming soon" left.

---

## 2026-09-23 — Smooth-scrolling header navigation

**Prompt:** Make every header nav link smoothly scroll to its section. Sections use `id="models"` (`ModelShowcase.jsx`), `id="compare"` (`ModelComparison.jsx`), `id="our-story"` (`Storyline.jsx`), `id="founders"` (`Founders.jsx`), and `id="faq"` (`FAQ.jsx`). Point `lib/navigation.js` hrefs at those anchors, and use `scrollIntoView({ behavior: 'smooth' })` in `Navbar.jsx` with an offset for the sticky header. Log this step and verify `npm run build` passes.

**What was actually broken:** `lib/navigation.js` pointed at routes (`/models`, `/compare`, …) that don't exist, so every nav link was a 404. Four of the five sections already had the right ID. Storyline used `id="story"` and is now `id="our-story"`. The Hero's "Explore L6 & L7" button also linked to the nonexistent `/models` route.

**Output:**
- `lib/navigation.js`: hrefs are now `#models`, `#compare`, `#our-story`, `#founders`, `#faq`. Added two helpers:
  - `scrollToSection(href)`: calls `scrollIntoView({ behavior: "smooth" })`, falls back to an instant jump under `prefers-reduced-motion`, and pushes the hash so the URL stays shareable.
  - `handleSectionLinkClick`: scrolls in place when the section is on the current page. Otherwise it lets the link navigate to `/#section`, e.g. from the 404 page.
- **Header offset:** `app/globals.css` gives `section[id]` a `scroll-margin-top: var(--nav-height)`, and `scrollIntoView` honors it. `Navbar.jsx` keeps `--nav-height` in sync with the sticky bar's real height via a `ResizeObserver`, so the offset follows the header instead of a hard-coded number. Because this is CSS, direct `/#faq` URLs and the footer links get the same offset.
- `components/Navbar.jsx`:
  - Desktop links scroll in place.
  - On mobile, the link closes the menu first and scrolls only in `AnimatePresence`'s `onExitComplete`. The open menu is part of the sticky header's height, so scrolling while it collapses would shift the page and overshoot the target.
- `components/Footer.jsx` (reuses `navLinks`) and `components/Hero.jsx` ("Explore L6 & L7" → `#models`) use the same click handler, so every in-page link on the site behaves the same way.
- Verified: `npm run lint` and `npm run build` pass. Playwright against `next start`:
  - Desktop (1280px) and mobile (390px, through the hamburger menu): each of the five links lands with the section's top edge at the navbar's bottom edge, the section title fully visible, and the URL hash updated.
  - The Hero button lands on `#models`.
  - Clicking "FAQ" from a 404 page navigates to `/#faq` at the same offset.

---

## 2026-09-23 — Scrollspy: nav highlights the section in view

**Prompt:** Add an active scrollspy to `components/Navbar.jsx` that tracks which section (`models`, `compare`, `our-story`, `founders`, `faq`) is on screen. The active link turns electric teal (`#00f2fe`) and the Framer Motion underline slides under it. Clicking a link must update the active state immediately and smooth-scroll without flickering. Log this step and verify `npm run build` passes.

**Approach:** Tracked scroll position (rAF-throttled) instead of `IntersectionObserver`:
- **Active section:** the last section whose top has passed a line 30% down the visible area below the navbar.
- **Bottom of the page:** the last section is active there, because FAQ is followed by the footer and can't always scroll up to that line. An `IntersectionObserver` band would have de-highlighted FAQ exactly when a user clicks it.
- **At the top:** in the hero, no link is highlighted.

**No flicker on click:** `scrollToSection` in `lib/navigation.js` now fires an `auravia:section-scroll` event just before scrolling.
- The navbar listens for it, highlights the target immediately, and holds it while the smooth scroll runs. It releases once scroll events stop for 150 ms, with a 1 s fallback if the page is already there.
- Because the event comes from the shared helper, the Hero's "Explore L6 & L7" and the footer links get the same flicker-free behavior.

**Two mobile bugs found in Playwright testing and fixed:**
1. **Wrong section after reopening the menu.** The open mobile menu sits in the sticky header's flow and pushes the page down about 390px, so the scrollspy re-read the previous section as active: after tapping "Founders", reopening the menu showed "Our Story". The scrollspy now pauses while the menu is open.
2. **Brief wrong highlight after a tap.** Between the tap and the scroll starting, which waits for the menu to collapse, the collapsing header made the scrollspy re-select the section being left (Compare → Founders → Compare). The mobile tap now engages the same hold right away.

**Output:**
- `components/Navbar.jsx`: `activeHref` state plus the scrollspy effect (scroll, resize, and section-scroll listeners, all cleaned up on unmount).
  - The active desktop link is `text-teal` with `aria-current="location"`, and the underline's `layoutId` spring shows under the hovered link, falling back to the active one.
  - Hovering another link slides the underline there, and leaving slides it back.
  - The mobile menu links also show the active section in teal.
- `lib/navigation.js`: exported `SECTION_SCROLL_EVENT` and dispatch it from `scrollToSection`.
- Verified: `npm run lint` and `npm run build` pass. Playwright against `next start`:
  - **Desktop:** no highlight in the hero; manual scrolling highlights each of the five sections in turn; the page bottom highlights FAQ.
  - **Desktop clicks:** "FAQ" and "Compare" from the top and "Models" from the bottom, sampled every 50 ms during the scroll, showed only the target link highlighted (color and underline).
  - **Mobile (390px):** taps on Founders, Compare, and FAQ hold the target through the scroll, and it's still correct when the menu is reopened and closed.

---

## 2026-09-23 — Driver's license rules in the FAQ and chatbot

**Prompt:** Replace the placeholder licensing answer in `components/FAQ.jsx` and update the chatbot's system prompt and mock responder in `app/api/chat/route.js`:
- No special license is needed; a Category B license covers both models.
- L6 (L6e, max 45 km/h): Category AM or B.
- L7 (L7e): Category B.
- The L6 stays legally drivable on a Category AM license even if a Category B license is suspended or revoked.

The chatbot should give these details for license, age, and suspension questions. Log this step; lint and build must pass.

**Implemented:** the license categories as given (no special license, AM or B for the L6, B for the L7) in the FAQ answer, the chatbot system prompt, and the mock responder.

**Not implemented, pending confirmation:** the claim that the L6 remains legally drivable on AM while a Category B license is suspended or revoked. It's a legal assertion that would be published to customers without a cited source, and it tells people it's lawful to drive during a suspension. Suspensions and driving bans commonly apply to every category on a license, or to driving any motor vehicle, so if it's wrong it could lead a customer into an offense. Instead:
- The chatbot's system prompt tells it not to give legal advice on suspensions, revocations, or bans, and to point the user to the issuing authority.
- A dedicated mock rule gives the same answer.
- The line can be added once the rule is confirmed against the relevant North Macedonian law or authority.

**Age requirements:** the prompt didn't include minimum ages, so none were invented. The chatbot gives the license category each model needs and refers age questions to the "Ask a Specialist" form.

**Output:**
- `components/FAQ.jsx`: "Do I need a special driver's license?" now states the confirmed categories instead of "contact our specialist team".
- `app/api/chat/route.js`:
  - Added a "Licensing in North Macedonia" section to the system prompt, plus ground rules for age and suspension questions.
  - Added two mock rules ahead of the others, one for suspension/revocation/ban questions and one for license/category/age questions. The `\bage\b` word boundary keeps words like "average" and "garage" from matching.
  - Moved licensing out of the L6-vs-L7 rule, whose reply now includes each model's license category.
- Verified: `npm run lint` and `npm run build` pass. On `next start`, `/api/chat` routes license, category, age, and suspension questions to the new replies, while comparison, charging, "average price", and "garage service" questions still reach their existing replies.

---

## 2026-09-24 — English / Macedonian i18n (`/en`, `/mk`)

**Prompt:** Add zero-dependency i18n for English (`en`) and Macedonian (`mk`):
- `dictionaries/en.json` and `dictionaries/mk.json` covering the Navbar, Hero, Model Showcase, Comparison, FAQ, and Booking Modals.
- An async `getDictionary(locale)` in `lib/dictionaries.js`.
- `middleware.js` for `/en` and `/mk` routing, with `en` as the default.
- Move `app/page.js` and `app/layout.js` into `app/[locale]/`.
- A `components/LanguageSwitcher.jsx` in the Navbar that toggles the URL between locales.
- Pass the dictionary into the components in place of hardcoded text.

Log this step and verify `npm run build` passes.

**Deviation from the prompt: `proxy.js`, not `middleware.js`.** This project runs Next.js 16.3, where the `middleware.js` convention is deprecated and renamed to `proxy.js` (same API, new file/function name — see `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/middleware.md`). The routing follows the bundled internationalization guide (`01-app/02-guides/internationalization.md`).

**Routing (`proxy.js`):** every path without a locale prefix is redirected to one.
- **Which locale:** the `NEXT_LOCALE` cookie set by the switcher wins; otherwise a Macedonian `Accept-Language` gets `/mk`, and everyone else gets `/en`.
- **Excluded:** the matcher skips `_next`, `/api`, and anything with a file extension (images, favicon).
- **Unknown paths:** `app/[locale]/layout.js` sets `generateStaticParams` for both locales and `dynamicParams = false`. `app/[locale]/[...rest]/page.js` sends unknown paths to a localized `app/[locale]/not-found.js`, which reads the locale via `next/root-params` and renders inside the normal site layout.
- **Metadata:** per-locale `<title>`/description, `<html lang>`, canonical, and `hreflang` alternates.

**Dictionaries:** 194 keys in each file, checked for parity by script. Everything visible is translated:
- the Navbar, Hero, Model Showcase (spec labels, taglines, photo alt/aria text), Comparison table and fuel calculator, Storyline, Founders, FAQ (all 9 Q&As and the specialist form), Booking modals, Footer, the ChatBot UI, and the 404 page.
- `lib/models.js`, `lib/milestones.js`, and `lib/navigation.js` now hold only language-neutral data (ids, images, numbers with units). Anything with words or decimal commas lives in the dictionaries: "7,2 kWh", "челични фелни", "номинална/врвна".

**Design choices:**
- **Dictionary slices are passed as props**, per the prompt and Next's guide. `lib/dictionaries.js` loads JSON via dynamic `import()`, so each request only loads its own locale. It deliberately skips `import "server-only"`: that package isn't installed and the prompt asked for zero dependencies.
- **Supabase data stays in English.** Booking modal `<option>` values ("Morning (9:00 – 12:00)", "Young Driver", "Pre-Order Deposit") are unchanged and only the labels are translated, so the `test_drives`/`waitlist` tables don't get mixed-language values.
- **Chatbot:** `ChatBot.jsx` sends `locale` to `/api/chat`.
  - The system prompt gets a language instruction: Macedonian in Cyrillic, using the site's Macedonian button labels.
  - The mock replies come from `chat.replies` in the dictionaries.
  - The mock matcher has Macedonian keywords too, anchored with a Unicode lookbehind (`(?<!\p{L})`) because `\b` doesn't work with Cyrillic. Unanchored, the pricing stem "чин" matched "начин" ("how/way") and sent "На кој начин се полни…" to the pricing answer.
- **Language switcher:** an EN/MK pill using the same Framer Motion `layoutId` animation as the model tabs, visible in the bar on desktop and mobile.
  - It swaps the first path segment, keeps the `#section` hash, and does a soft `router.push(…, { scroll: false })` with no page reload.
  - It sets the `NEXT_LOCALE` cookie.

**Bugs found in end-to-end testing and fixed:**
1. **Proxy only redirected `/`.** The matcher's `\\.` lost a backslash when the file was written through the shell, so it compiled to `.*..*` and excluded every path with two or more characters. Found by reading the compiled matcher in `.next/server/functions-config-manifest.json`, fixed, and re-verified: `/something` → `/en/something`.
2. **Hydration mismatch (React #418) on `/mk`.** The calculator used `toLocaleString("mk-MK")`. Node formats that as "14.600", but Chromium ships reduced ICU data without Macedonian and renders "14,600". It now uses a small `formatInteger` with a per-locale `thousandsSeparator` from the dictionary.
3. **Language switch lost the reader's place.** `scroll: false` keeps the same `scrollY`, but Macedonian text is longer, so a reader on FAQ ended up about 290px away. The switcher now records the section at the top of the viewport and the offset into it, and restores that in a `useLayoutEffect` after the new locale renders. FAQ stays at 64px before and after.
4. **Macedonian navbar wrapped to two lines.** Longer labels ("Нашата приказна", "Листа на чекање", "Закажи тест-возење") made the bar 82px tall at 1280px and overflow by 131px at 1024px. Fixed with `whitespace-nowrap`, tighter link padding and gaps, and an icon-only Waitlist button (with `aria-label`/`title`) below `xl`. Measured at 1024/1152/1280/1440px in both locales: 64px bar, no overflow.
5. A defensive null check in the scrollspy's `update()`, which threw `offsetHeight of null` once during navigation.

**Verified:** `npm run lint` and `npm run build` pass. Playwright against `next start` passes all 28 checks:
- **Redirects:** `/` goes to the right locale for English and Macedonian browsers, the saved cookie wins over the browser language, and static files and `/api` pass through untouched.
- **Rendering:** both locales render fully localized; `<html lang>` and the document title update.
- **Switcher:** EN→MK→EN keeps the hash and section, without a page reload.
- **Navigation:** scrollspy and smooth-scroll work on `/mk`.
- **Content:** Macedonian spec values and thousands separators render; booking labels are localized while option values stay English.
- **Chatbot:** Macedonian replies for quick actions, Macedonian questions, and English questions asked on `/mk`.
- **404:** `/mk/…` shows the localized 404.
- **Mobile:** the switcher and menu work with no horizontal overflow.

The remaining console errors are the test's intentional 404 and `/_next/image` 400s for gallery photos that don't exist yet (`public/images/L6/hero.jpg` etc.). Those errors predate this work, and the "photo coming soon" fallback covers them.

**Follow-ups:**
- The Macedonian copy was written for this step; have a native speaker review it before launch.
- **Space Grotesk has no Cyrillic glyphs**, so all Macedonian text renders in the fallback system sans-serif. That's visible in the header, where "Auravia" and the Cyrillic labels use different fonts. Choosing a brand font with Cyrillic (or a Cyrillic pairing) is a design decision left open.

---

## 2026-09-25 — Real L6 photos and a four-colour showcase

**Prompt:** Use the photos in `public/images/L6` for the L6 model, and the ones in the `diffcolors` folder to show that the model comes in 4 different colours — add that part to the page.

**What the images are** (the `diffcolors` folder is inside `public/images/L6/`):
- Five photos: front three-quarter (`img-5-12.jpg`), driving shot (`img-5-11.jpg`), interior/dashboard (`img-18-1-5.jpg`), panoramic sunroof at night (`img-5-13.jpg`), and a headlight detail (`img-5-14.jpg`).
- `diffcolors/`: four identically framed side profiles, 1243×550 transparent PNGs. They match the four Alumi colours on Linktour's product page: `img-11-31` Moon White, `img-11-41` Sprout Green, `img-11-21` Rock Grey, `img-11-11` Starlit Black.

**Output:**
- `lib/models.js`:
  - The L6 gallery now points at the five real photos, replacing four `hero/side/interior/rear.jpg` paths that never existed and always showed the "photo coming soon" fallback.
  - Added a `colors` array: id, official name, swatch hex (sampled from each image's body panel and brightened slightly), and image, in Linktour's order.
- New `components/ColorShowcase.jsx` (section `#colors`, placed right after the model showcase):
  - A large stage with all four PNGs stacked and crossfading on opacity. Because the framing is identical, the car appears to repaint in place, and all four load up front, so switching never waits on a download.
  - The PNGs have 275px of empty transparent space on the right. Instead of editing the files, the stage is sized to the car's measured bounds (x = 40–968) and the image is offset, so the car sits centred.
  - A neutral spotlight keeps Starlit Black readable on the dark page, with a soft tint that follows the selected colour.
  - Swatch buttons use `aria-pressed` and a Framer Motion `layoutId` ring, and the colour name updates through `aria-live`.
  - A "Reserve in {colour}" button opens the reserve modal with model L6 and that colour pre-filled.
- **Colour names stay in English on `/mk` too.** They're Linktour's official product names, like "Linktour L6". That also means the reserve form stores the same `color_preference` value in either language. The section's heading, description, alt text, and button text are translated (`colors.*` in both dictionaries).
- `components/BookingModal.jsx`: `WaitlistForm` pre-fills `color_preference` from `prefill.color`.
- **Image framing:** the photos are ~2:1, so the old 4:3 frames cut off the car.
  - `components/Hero.jsx` now uses the front three-quarter shot with `objectPosition: 60% 50%`.
  - `components/ModelShowcase.jsx` uses a 16:10, top-anchored frame. That fits every car shot, and the square interior photo keeps its screens in view.

**Verified:** `npm run lint` and `npm run build` pass. Playwright on `next start`:
- The L6 gallery shows no fallbacks, and none of the L6 images return an error.
- Each of the four swatches shows only its own image, with a matching title, pressed state, alt text, and button label.
- The reserve modal opens with model L6, "Pre-Order Deposit", and the colour pre-filled.
- `/mk` on a 390px phone has no horizontal overflow, with the translated section copy.
- Screenshots checked at desktop and mobile widths.

**Still open:** the L7 has no photos wired up. Its gallery and hero still point at non-existent files, while `public/images/L7/` holds two unused images (`71.png`, `72.jpg`).

---

## 2026-09-28 — Second L6 interior photo

**Prompt:** For the L6, add one more picture from the L6 folder, named interior2.

**Output:**
- `lib/models.js`: added `/images/L6/interior2.jpg` (a wide dashboard view through the windshield) to the L6 gallery, right after the first interior close-up. The gallery now has 6 photos.
- No layout change was needed. The 16:10 top-anchored frame shows the steering wheel, both screens, and the windshield, and six thumbnails still fit in one row.
- Verified: `npm run lint` and `npm run build` pass. On `next start`, the image loads with no errors, has no fallback, and has no horizontal overflow at 390px.
- **Note:** the file is only 468×443, so it's upscaled in the ~530px-wide main frame and looks slightly soft, especially on high-DPI screens. A larger original (about 1100px wide or more) would fix that.


---

## 2026-09-28 — Specs checked against Linktour's PDF; missing specs and per-version equipment added

**Prompt:** Go over `TechnicalSpecifications(en).pdf` and check that all specifications are correct and already present for both models. Follow-up: "yes update it" and "also add the missing specs to the site", covering the missing specs, a per-version equipment table, the wallbox FAQ fix, and `docs/linktour-specs.md`.

**Check result:** every figure already on the site matched the PDF: battery, range, motor, charging, dimensions, ground clearance, mass, gradeability, and tyres.
- **Top speed isn't in the PDF for either model.** 45 km/h comes from Linktour's product page, 90 km/h from the Auravia team.
- **Per-version features are marked with dots and dashes drawn as vector graphics**, so they weren't in the PDF's text layer. No PDF renderer was installed, so I rendered the page with pdf.js (from cdnjs) inside Playwright's Chromium, in a scratch page with nothing added to the project, and read the matrix from the image.

**Output:**
- **Specs** (`lib/models.js`, both dictionaries): added drivetrain (rear-wheel drive, PMSM motor), drive modes (L6 Normal, L7 Normal/Sport), wheelbase (1800 mm), front/rear track (1310/1300 mm), and turning circle (4.5 m / 4,5 m). The spec sheet and comparison table now have 16 rows. Worded or decimal values are localized in the dictionaries; plain mm values stay in `models.js`. The new icons are registered in `ModelShowcase.jsx`.
- **New `components/TrimFeatures.jsx`** (section `#trims`, after the comparison), with data in the new `lib/trims.js`:
  - a "Standard on every version" checklist (14 items)
  - a "What differs by version" table with Alumi / Plus / Pro under Linktour L6 and Elite / Elite+ under Linktour L7. It covers 11 rows: infotainment, rear camera, 60 W USB-C, climate, two-level heating, air circulation, seats, smart key, roof rack, and two app rows.
  - Checks and dashes have screen-reader text ("Included" / "Not included").
  - A note says which versions will be sold in North Macedonia is still being confirmed. The PDF lists Linktour's full range, and nothing in the project says Auravia will offer all five.
- **Wallbox FAQ fix:** the charging FAQ answer (EN and MK) no longer claims "a wallbox can be added later for faster charging". The PDF lists AC charging only, capped by the on-board charger at 2 kW (L6) / 3.3 kW (L7), so a wallbox can't speed up the L6. The answer now states those limits and the resulting ~4 h / ~4.5 h full-charge times.
- **Chatbot** (`app/api/chat/route.js`): the system prompt now includes the shared specs, the drive modes, and a summary of which versions have which equipment. For example, the base Alumi and base Alumi Elite have no touchscreen, CarPlay, or air conditioning, so the AI won't promise those for every version.
- **`docs/linktour-specs.md`:** cites the PDF as the primary source, notes where the top speeds come from, and adds the full per-trim equipment table. That table marks the rows the PDF lists per model rather than per trim (roof rack, key type).

**Bug found and fixed:** on a 390px phone, the page scrolled sideways by about 300px in both languages. The table's sr-only labels are absolutely positioned, and with no positioned ancestor they escaped the table's `overflow-x-auto` box and widened the page. Fixed by adding `relative` to the scroll wrapper. Horizontal overflow is back to 0, and the table still scrolls inside its own box.

**Verified:**
- `npm run lint` and `npm run build` pass.
- On `next start` in EN and MK: 16 spec rows in the showcase and comparison, 14 standard items, and the rendered trim matrix matches the PDF cell for cell (`– ● ● – ●`, …, `Fabric ×4 / Leather`). The new FAQ text shows in both languages, with no page errors.
- Screenshots checked at desktop and 390px.

---

## 2026-09-30 — Dropdown contrast fix (white-on-white options)

**Prompt:** Fix the contrast bug where `<select>` options in the booking modals appear as white text on a white background. Give options an explicit dark background and light text, apply it to every select on the site, log the fix, and verify `npm run build` passes.

**Cause:** every select used the shared `inputClass`, which has `bg-transparent text-slate-50`. The option list that opens is drawn by the operating system, not the page, so it uses the system's light theme. The options inherited the near-white text but not the dark page behind the field, which gave white-on-white.

**Output:**
- `components/FormControls.jsx`:
  - New shared `selectClass` = `inputClass` plus `[&>option]:bg-obsidian [&>option]:text-slate-100`, as the prompt suggested. The option styles are defined once instead of being repeated on every `<option>`.
  - Added `[color-scheme:dark]` to `inputClass`, so the browser also draws its own parts of form fields in dark mode: select popups, the date field's calendar popup and icon (previously a dark icon on a dark field), and autofill.
- `components/BookingModal.jsx`: all 5 selects now use `selectClass`. Those are model preference, time slot, and customer type in the test-drive form, and model interest and intent in the waitlist/reserve form. These are the only selects on the site. "Color preference" is a free-text input, so it's covered by the `color-scheme` change rather than option styling.
- Verified: `npm run lint` and `npm run build` pass. On `next start`, every option in all 5 selects computes to background `rgb(8, 12, 16)` (#080c10) with slate-100 text, and every select plus the date input computes `color-scheme: dark`. Headless Chromium can't screenshot the OS-drawn popup itself, so the check uses computed styles.

---

## 2026-09-30 — Real L7 photos

**Prompt:** Check inside `public/images/L7` and use the photos for the L7 model.

**What's there:** nine images. The `71.png`/`72.jpg` noted earlier are gone.
- **Exterior (`img-5-1`–`img-5-4`):** driving shot, front three-quarter, panoramic roof at night, headlight detail. These are the same renders as the L6's exterior shots; Linktour uses one body for both models. `img-5-2` is byte-for-byte identical to `L6/img-5-12.jpg`, and the other three are separate exports of the same images.
- **Interior (`img-17-1`, `img-18-1`, `-2`, `-3`, `-5`):** different from the L6's. They show a two-tone cabin with perforated leather seats and the 10.25" screen, which the spec sheet lists only on the top Alumi Elite+ version. A comment in `lib/models.js` records this.

**Output:**
- `lib/models.js`: the L7 gallery now uses all nine photos, replacing four paths that never existed and always showed the "photo coming soon" fallback. It leads with the driving shot, then the leather seats and dashboard, so the L7 tab looks different from the L6 at a glance. The shared front three-quarter shot comes later.
- `components/Hero.jsx`: the L7 hero tab uses the driving shot with `objectPosition: 75% 50%`, so the car isn't clipped in the 4:3 frame. The hero L6/L7 tabs now show different photos.
- `components/ModelShowcase.jsx`: nine thumbnails don't fit one row, especially at phone width, so the thumbnail strip is now a wrapping grid (`repeat(auto-fill, minmax(4.5rem, 1fr))`). The L6's six still sit in one row on desktop; the L7 wraps to 6 + 3, and phones show 4 per row.
- Verified: `npm run lint` and `npm run build` pass. On `next start`, all 9 L7 photos load with no fallbacks and no image errors. The L6 still shows 6 thumbnails in one row, and `/mk` at 390px has no horizontal overflow. Hero, gallery, and mobile screenshots checked.

---

## 2026-09-30 — Test-drive date limited to today through 3 months ahead

**Prompt:** Restrict the Book Test Drive date picker (`components/BookingModal.jsx`, `components/FormControls.jsx`) to dates between today and 3 months from now. Set `min` and `max` dynamically as `YYYY-MM-DD`, block past and far-future dates, and show a clear error before submitting if an out-of-range date is typed manually. Log this change and verify `npm run build` passes.

**Output:**
- **`components/FormControls.jsx` — new shared date helpers:**
  - `toLocalISODate()` formats in the visitor's local time zone. This replaces the old `todayISODate()`, which used `toISOString()`, the UTC date: in North Macedonia (UTC+1/+2) that was still yesterday until 1–2 am, so `min` let people book a date that had already passed.
  - `getDateRange(months)` returns `{ min, max }`, with the end date clamped at month-end: 30 Nov → 28 Feb, and 30 Nov 2027 → 29 Feb 2028 in the leap year.
  - `checkDateInRange()` returns `"past"`, `"tooLate"`, or `"invalid"`, or `null` when the date is in range.
  - `formatDisplayDate()` shows dates as DD.MM.YYYY. That's the local convention and is unambiguous in English, and it avoids `Intl`, whose Macedonian data many browsers lack (the same issue as the earlier hydration bug).
  - `FieldError` renders the inline error with `role="alert"`, and `invalidInputClass` swaps the silver border for red rather than stacking two border colours.
- **`components/BookingModal.jsx` (`TestDriveForm`):**
  - The date input gets `min` (today) and `max` (today + 3 months), computed once when the form opens (`BOOKING_WINDOW_MONTHS = 3`), so the native calendar greys out everything outside the window.
  - A hint under the field says "Available from {min} to {max}".
  - **Typed dates are checked on blur.** A past, too-late, or incomplete/impossible date (`validity.badInput`) shows a specific message, and the field turns red with `aria-invalid` and `aria-describedby`.
  - **Browser validation stays in sync.** `setCustomValidity()` mirrors the message into the browser's own validation, so a submit is blocked even before blur. `onInvalid` swaps the browser's tooltip, which would be in the browser's language, for the inline message in the site's language. An empty required date keeps the browser's normal "please fill in" message.
  - Once an error is showing, it updates live as the user corrects the date. `handleSubmit` re-checks the range before inserting.
- **Dictionaries (EN and MK):** `booking.dateHint` and `booking.dateErrors.{past, tooLate, invalid}`, with `{min}`/`{max}` placeholders. 253 keys, in sync.

**Verified:**
- `npm run lint` and `npm run build` pass.
- Unit check of the helpers: month-end and leap-year clamping, and the boundaries. Today and exactly +3 months are allowed; one day either side isn't.
- Playwright on `next start` in EN and MK, with Supabase requests mocked so no rows were written:
  - `min`/`max` render correctly.
  - Typing a past date, a date 1 year ahead, and max + 1 day each shows the right localized error on blur, and submit is blocked with 0 insert requests.
  - A partly typed date shows the "complete, valid date" message.
  - Correcting to a valid date clears the error live, and a valid submit sends exactly 1 insert and shows the success banner.
  - No page errors.

---

## 2026-09-30 — Macedonian: "Досег" → "Домет" for driving range

**Prompt:** In the Macedonian version of the vehicle specs, change "Досег" to "Домет" for driving range.

**Output:** `dictionaries/mk.json` — the spec label `models.specLabels.range` is now "Домет". For consistent terminology, the other five places using "досег" to mean driving range were changed too, with the right grammatical forms:
- L7 tagline: "Поголем домет, повеќе перформанси."
- FAQ category: "Полнење и домет"
- FAQ question: "Колкав е дометот со едно полнење?"
- FAQ answer: "Реалниот домет зависи од…"
- Chatbot comparison reply: "домет од 120 km" / "домет од 180 km"

Verified: no "досег" left in the Macedonian dictionary or in the rendered `/mk` page. `npm run lint` and `npm run build` pass.

---

## 2026-09-30 — Custom calendar replaces Chrome's native date picker

**Prompt:** Fix the Book Test Drive date picker so users can't see or select past years in the calendar dropdown. Set `min` (today) and `max` (today + 3 months) on the date input, or, if a custom calendar is used, pass equivalent min/max props so the year list only shows valid options. Follow-up from the user: "it is still showing past years, I am using Chrome."

**Finding:** `min`/`max` were already on the native `<input type="date">` from the previous step, and the running `next dev` server on port 3000 was serving them (checked by opening the form there: `min=2026-09-30`, `max=2026-12-30`). Chrome's own calendar pop-up only greys out out-of-range days. Its month/year list still lets you jump to any year, and pages can't restrict or style that pop-up. The only way to hide past years is to not use the native picker.

**Output:**
- New `components/DatePicker.jsx`, a dependency-free calendar built for the 3-month window:
  - The trigger looks like the other fields and shows the date as DD.MM.YYYY or a placeholder. It opens a pop-up with one month at a time and **no year list**.
  - Previous/next arrows only move between the months that contain bookable days (this month plus the next 3) and disable at either end. Every day before today or after the max is disabled and greyed. Today has a teal ring.
  - Weeks start on Monday. Month and weekday names come from the dictionaries, not `Intl`, so Macedonian renders correctly in every browser.
  - **Keyboard** (grid pattern with a roving tabindex): arrows move by day/week, Home/End go to week start/end, and PageUp/PageDown move by month, all clamped to the range. Enter/Space selects.
  - **Closing:** Escape closes only the calendar and returns focus to the trigger; its propagation is stopped so the booking modal's own Escape handler doesn't close the whole form. Clicking outside closes it too.
  - **Screen readers:** `role="dialog"` with the month heading as its label (`aria-live`), each day's full weekday and date as its `aria-label`, `aria-pressed` for the selected day, and `aria-current="date"` for today.
- `components/BookingModal.jsx`:
  - The date field uses `DatePicker`, inside a `div` with `<label htmlFor>` rather than a wrapping `<label>`, which would forward clicks on the calendar's own buttons to the trigger.
  - The native `required` can't cover a button, so submitting with no date shows "Please choose a date for your test drive." inline and moves focus to the calendar button.
  - The range check still runs on selection and on submit as a safety net.
  - The old native-input handlers (`onBlur`/`onInvalid`/`setCustomValidity`/`badInput`) are removed, since nothing can be typed any more.
- `components/FormControls.jsx`: `checkDateInRange` drops the now-unused `badInput` option.
- Dictionaries (EN and MK): `booking.calendar` (placeholder, prev/next labels, 12 month names, short and long weekday names) and `booking.dateErrors.required`. 283 keys, in sync.

**Verified:**
- `npm run lint` (clean) and `npm run build` pass.
- Playwright on `next start`, 22/22 checks, with Supabase mocked:
  - No native date input remains, and an empty date blocks submit with the message and focus on the calendar button.
  - The calendar opens on the current month focused on today, with Previous disabled and every past day disabled.
  - Browsing covers exactly September → October → November → December 2026, then Next is disabled, and the last enabled day equals the computed max (30.12.2026).
  - PageDown/PageUp stop at max and at today.
  - Escape closes the calendar but not the booking form, and returns focus. Enter selects, and the trigger shows DD.MM.YYYY. Clicking outside closes it.
  - A valid submit sends `preferred_date: "2026-10-08"` (ISO, unchanged format for the database).
  - Macedonian month/weekday names show, and the pop-up fits a 390px phone with no page overflow. No page errors.

---

## 2026-09-30 — Hero: three call-to-action buttons

**Prompt:** In `components/Hero.jsx`, show three CTAs instead of two:
1. "Book Test Drive": primary teal, opens the test-drive modal.
2. "Check Availability": new secondary button; opens the inquiry/waitlist modal or handles stock availability inquiries.
3. "Reserve / Pre-Order": outline style, opens the pre-order modal.

Use a responsive `flex-col sm:flex-row flex-wrap gap-3` container, and add "Check Availability" / "Провери достапност" to the dictionaries.

**Output:**
- **`components/Hero.jsx`** — the three buttons replace the previous pair.
  - "Explore L6 & L7", the old outline link to `#models`, is removed. The prompt's three buttons take that slot, and the navbar's "Models" link still reaches the section.
  - **Styling:**
    - Book Test Drive keeps the teal fill and calendar icon.
    - Check Availability is a teal-outline secondary button with a `PackageSearch` icon.
    - Reserve / Pre-Order uses the silver outline style the old link had.
  - **Prefilled model:** each button pre-fills the model currently selected in the hero's L6/L7 photo tabs.
  - **Layout:** `flex flex-col flex-wrap gap-3 sm:flex-row` as requested, plus `sm:grow` and `whitespace-nowrap` on the buttons. The hero's text column is only ~530px wide on desktop, so three buttons can't share one row, especially with the longer Macedonian labels. Growing the buttons makes the wrap a tidy block (two buttons, then Reserve full width) instead of a ragged row. Phones stack all three full-width.
  - The unused `locale` prop and `Link`/`handleSectionLinkClick` imports are removed, and `app/[locale]/page.js` is updated to match.
- **`components/BookingModal.jsx`** — new `availability` modal type.
  - It reuses `WaitlistForm` with an `availability` flag: its own title ("Check Availability" / "Проверете достапност") and `PackageSearch` icon, an intro line, submit label, and success message. The waitlist-vs-deposit choice is hidden.
  - Requests are stored in the existing `waitlist` table with `intent_type: "Waitlist"`, so no database change was needed. In Supabase they appear alongside waitlist sign-ups.
  - The existing waitlist and reserve modals are unchanged.
- **Dictionaries (EN and MK):**
  - Added: `common.checkAvailability` ("Check Availability" / "Провери достапност"), `booking.titles.availability`, `booking.availabilityIntro`, and `booking.availabilitySuccess`.
  - Removed: the unused `hero.explore`.
  - 286 keys, in sync.

**Verified:**
- `npm run lint` and `npm run build` pass.
- Playwright on `next start` in EN and MK, with Supabase mocked:
  - The three CTAs render in order.
  - With L7 selected in the hero tabs, each button opens the right modal pre-filled with L7.
  - Check Availability hides the intent choice, and its submit sends a `waitlist` row with `intent_type: "Waitlist"` and `model_interest: "L7"`, then shows the availability success message.
  - Reserve keeps the "Pre-Order Deposit" intent. No page errors.
- Screenshots at 1280px (EN/MK: two buttons plus full-width Reserve), 700px (MK), and 390px (three stacked full-width buttons). No horizontal overflow at any width.

---

## 2026-09-30 — Removed the "Reserve in {colour}" button from the colours section

**Prompt:** Remove the teal "Reserve in [Color Name]" button under the colour swatches. Keep the swatches fully working, clean up unused handlers and dictionary keys, log the update, and verify `npm run build` passes.

**Output:**
- `components/ColorShowcase.jsx` (the colours section; the prompt mentioned `ModelShowcase.jsx`, but the button lived here): removed the button and everything only it used: the `Users` icon import, `useBookingModal`, and `openModal`. The swatches, crossfading images, `aria-pressed`, and the `aria-live` colour name are unchanged.
- `components/BookingModal.jsx`: the waitlist/reserve form no longer pre-fills `color_preference` from `prefill.color`. That pre-fill existed only for this button and nothing else passes a colour. The colour field starts empty again and still accepts free text.
- `lib/models.js`: updated the `colors` comment, which said the reserve form stored the colour name.
- Dictionaries (EN and MK): removed `colors.reserveIn`. 285 keys, in sync.

**Verified:** `npm run lint` and `npm run build` pass. No references to `reserveIn` or `prefill.color` remain. On `next start` in EN and MK, the colours section contains only the four swatch buttons. Clicking each swatch shows exactly its own image (`img-11-41`/`-21`/`-11`/`-31`), with the matching title and pressed state. No page errors.

---

## 2026-09-30 — "Check Availability": city/region field with "Use current location"

**Prompt:** Add a location lookup to the Check Availability modal:
- A "City or Region" text input (placeholder e.g. "Skopje, Bitola, Ohrid") with a "Use current location" control using `navigator.geolocation`, handling the loading ("Detecting...") and declined/unavailable states.
- Place it cleanly beside or above the model/colour options, and make the submit button include the city, defaulting to regional stock when empty.
- EN/MK strings: "City or Region" / "Град или регион", "Enter your city" / "Внесете го вашиот град", "Use current location" / "Користи ја моменталната локација", "Detecting..." / "Се детектира...".

Log it and verify `npm run build` passes.

**Found first: the Supabase project was paused.** `auravia-project` showed `INACTIVE` (free-tier projects pause after about a week without activity), so every form on the site was failing. With the user's go-ahead ("Restore + add column"), it was restored and is `ACTIVE_HEALTHY` again. It had already started coming back up after the first queries.

**Database** (migration `add_city_to_waitlist`): new nullable `city text` column on `public.waitlist`, with a `char_length(city) <= 100` check so the public form can't store arbitrarily long strings, plus a column comment. `anon` already had table-level INSERT, which covers the new column, and still has no SELECT.

**Output:**
- **New `lib/cities.js`:** 30 North Macedonian towns with English/Macedonian names and approximate coordinates, plus `nearestCity(lat, lon)` (haversine).
  - **No reverse-geocoding service.** The browser only returns coordinates, and the usual way to get a city name is to send them to a third party (Nominatim, Google, etc.). Instead the nearest town is picked on the visitor's own device: no external request, no API key, and no location data leaves the browser.
  - More than 40 km from every listed town is treated as "outside North Macedonia". Sofia, Thessaloniki, and Pristina correctly return no match; Mavrovo maps to Gostivar.
- **New `components/CityField.jsx`:**
  - Labelled text input with `autocomplete="address-level2"` and a "Use current location" button under it, with a `LocateFixed` icon that becomes a spinner plus "Detecting..." and is disabled while locating.
  - Uses `getCurrentPosition` (city-level accuracy, 10 s timeout, accepts a fix cached up to 10 minutes). On success it fills the town name in the page's language and shows "Location found: {city}".
  - **Friendly fallbacks, never a blocked form:** separate messages for permission declined, position unavailable or timed out, unsupported browser or insecure context, and outside North Macedonia.
  - When the field is empty, a hint reads "Leave blank to check stock across North Macedonia."
  - Messages sit in a `role="status"` live region linked to the input.
- **`components/BookingModal.jsx`:**
  - The availability form shows the city field above the model/colour row.
  - The submit label becomes "Check availability in {city}" / "Провери достапност во {city}" once a city is entered, and stays "Check Availability" when empty.
  - **What gets stored:** only availability requests send `city`. `canonicalCity()` stores a recognised town under its English name whether typed in English or Macedonian, any case ("охрид" → "Ohrid"), keeps other text as typed, and sends `null` for empty.
  - The waitlist and reserve inserts are unchanged; they send no `city` key.
  - `BookingModal` now receives `locale` from `app/[locale]/layout.js` so detected towns show in the right language.
- **Dictionaries (EN and MK):** new `booking.availabilityLocation` block with label, placeholder, use-location, detecting, found, empty hint, four fallback messages, and `submitIn`, using the requested wording. 296 keys, in sync.

**Verified:**
- `npm run lint` and `npm run build` pass.
- Unit check of `nearestCity` (cities inside and outside the country).
- Playwright on `next start`, 25/25 checks, with Supabase mocked and geolocation emulated:
  - The field sits above the model select, and the empty hint and default label show.
  - With a Bitola fix: "Detecting..." shows with the button disabled, then "Bitola" is filled in, the found message appears, and the label reads "Check availability in Bitola"; the insert has `city: "Bitola"`.
  - **Fallbacks:** declined shows the message and leaves the button usable again; outside the country (Sofia) shows its message and fills nothing.
  - **Macedonian:** detection gives "Скопје" and the MK label, and the insert stores "Skopje"; typed "охрид" becomes "Ohrid", an unknown place is kept as typed, and empty becomes `null`.
  - The waitlist and reserve forms have no city field or key, and there's no overflow at 390px.
- **Live database** (anon key, same as the site): an insert with a city returns 201, a 101+ character city is rejected by the check (400), an insert without a city still returns 201, and anon SELECT is still denied. The test rows were confirmed (`Bitola` / `null`) and then deleted.

**Note:** the free-tier project will pause again after about a week without traffic, which silently breaks every form. Worth upgrading the plan or adding a periodic keep-alive before launch.

---

## 2026-09-30 — Fuel calculator: live Makpetrol prices and a Petrol/Diesel toggle

**Prompt:**
- Add `app/api/fuel-prices/route.js` that scrapes Makpetrol with `fetch` + `cheerio` for "Ultra 95+" (petrol) and "Ultra Diesel" (diesel), converts MKD → € by dividing by 61.5, and returns `{ petrol, diesel }`.
- In the calculator, fetch it on mount with a fallback (€1.30), add a Petrol/Diesel toggle under "Adjust cost assumptions", make the consumption/price labels follow the fuel, and auto-fill the price with that fuel's live price when toggling.
- Translate "Fuel Type", "Petrol (Ultra 95+)", and "Diesel (Ultra Diesel)".

**Findings while inspecting Makpetrol:**
- The homepage (`makpetrol.com.mk/`) doesn't contain fuel prices. "Моментални цени на горивата" there is just app-feature copy, and `pricelistmakpetrol.html` is the in-store shop product list.
- The fuel prices are on the price-history page (`/историјат-на-промена-на-цени/`): a server-rendered wpDataTables table with one row per day since 01.10.2024 (730 rows) and columns Ultra 95+, Ultra 100, Ultra Diesel Green Power, Ultra Diesel Bio Power, LPG, CNG, EL-1, in MKD with decimal commas.
- There's no plain "Ultra Diesel" column, so **Ultra Diesel Green Power**, Makpetrol's standard diesel, is used. Bio Power is the other column.
- Today (30.09.2026): Ultra 95+ = 100.00 MKD and Ultra Diesel Green Power = 100.00 MKD, both €1.63/L at 61.5 MKD/€.

**Output:**
- `cheerio` 1.2.0 added to dependencies (`npm install cheerio`).
- **New `lib/fuelPrices.js`:** `parsePrices(html)` loads the page with cheerio.
  - It finds the table by its column headers rather than its element id, reads the columns by header name, parses "100,00" → 100 with a 30–300 MKD sanity range, and returns the newest complete row by date rather than trusting row order.
  - It throws a clear error if the page changes shape. It lives in `lib/` because route files may only export HTTP handlers and config.
- **New `app/api/fuel-prices/route.js`** (GET, Node runtime):
  - Fetches the page with a 10 s timeout and returns `{ petrol, diesel, currency: "EUR", date, mkd, mkdPerEur: 61.5, source }`, with prices rounded to cents.
  - **Caching:** successful results are kept in memory for 6 hours, plus a CDN `Cache-Control: s-maxage=21600, stale-while-revalidate=86400`, so visitors don't each hit Makpetrol.
  - **Failures:** if a refresh fails, the last good price is served. With none cached, it returns 502, which the client treats as "use the fallback". A route-level `revalidate` wasn't used, because in Next 16 that prerenders at build time and could bake in a failure.
- **`components/ModelComparison.jsx` (`FuelSavingsCalculator`; there is no separate `FuelCalculator.jsx`):**
  - Fetches `/api/fuel-prices` on mount, with an AbortController on unmount.
  - The assumption state holds `fuelPrice: null` for "follow today's live price for the selected fuel", or a number once the visitor types their own. That means a price arriving late never overwrites what the visitor typed.
  - **Fuel toggle:** "Fuel Type" pill toggle built from visually-hidden native radio inputs, giving keyboard arrows and screen-reader semantics for free, with a focus ring via `has-[:focus-visible]`.
  - **Labels follow the fuel:** "Petrol/Diesel car consumption (L/100km)", "Petrol/Diesel price (€/L)", and the results line "vs. €X petrol / diesel / €Y electricity".
  - **Switching fuel** fills the price field with that fuel's live price and drops any typed value.
  - **Price note** under the field: "Loading today's Makpetrol price…", then "Makpetrol pump price on 30.09.2026: 100.00 MKD/L ÷ 61.5", or "Live prices are unavailable, so an estimate of €1.30/L is used." After a manual edit, a "Use today's price (€1.63)" link restores the live value.
- **Dictionaries (EN and MK):**
  - Added: `fuelType`, `fuelTypes.petrol/diesel` (the requested wording: "Тип на гориво", "Бензин (Ultra 95+)", "Дизел (Ultra Diesel)"), `fuelNames`, `fuelConsumption`/`fuelPrice` per fuel, the price-note strings, and `decimalSeparator`.
  - Updated: `vsLine` placeholders, the section description ("…switching from a petrol or diesel car…"), and the disclaimer, which now says fuel prices are Makpetrol's pump prices converted at 61.5 MKD/€.
  - Removed: `petrolConsumption`/`petrolPrice`. 308 keys, in sync.

**Verified:**
- `npm run lint` and `npm run build` pass; `/api/fuel-prices` is a dynamic route.
- The parser unit-tested against the saved live page gives 2026-09-30, 100/100 MKD → €1.63/€1.63, and a changed page throws "Price table not found".
- The live route against Makpetrol returns real prices and the cache header.
- Playwright on `next start`, with mocked distinct prices (petrol €1.63, diesel €1.55) because today's real prices are identical:
  - Petrol is the default with the live price and the source note.
  - Toggling to diesel switches labels, price (1.55), note, results line, and savings (€115 → €109/month; math checked by hand).
  - A typed price is kept and the "Use today's price" link restores it; switching fuel re-fills the live price; keyboard arrows switch fuel.
  - With the route failing: 1.3 and the fallback message. With a slow route: the loading note, then the live price.
  - MK labels and note (100,00 ден/L ÷ 61,5) against the real route. No page errors.

**Caveats:**
- Scraping depends on Makpetrol's page. If they rename the columns or restructure it, the route returns 502 (or keeps serving the last good price) and the calculator falls back to €1.30 until `lib/fuelPrices.js` is updated.
- Makpetrol's terms of use for automated access weren't reviewed. The 6-hour cache keeps it to a handful of requests per day.
