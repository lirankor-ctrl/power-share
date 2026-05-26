# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # one-time
npm run dev        # Vite dev server on http://localhost:5173 (auto-opens)
npm run build      # production build into dist/
npm run preview    # serve the built dist/ locally
```

No test runner, linter, or formatter is configured — `npm run build` is the only way to validate changes end-to-end. Treat a successful build as the gate for "ready".

## High-level architecture

Single-page React 18 app built with Vite. **MVP intentionally has no backend** — all data is either demo seed data or persisted to `localStorage`. Do not introduce Supabase, auth, or a database until the basic UX flow is locked.

### State model

All app state lives in **one context** (`src/context/AppContext.jsx`) and is mirrored to `localStorage` under the key `power-share-state-v1` on every change. The context holds three top-level fields:

- `user` — the registered profile (one user per device). Setting this in onboarding is what gates routing.
- `activeSession` — the currently-running charging session, or `null`. Only one can exist at a time.
- `sessions[]` — completed sessions, newest-first. Pushed to when `endSession()` is called.

A session captures a `chargerSnapshot` (owner name/phone/address/notes) at start time so historical sessions remain readable even if the underlying demo charger record changes. Mutations go through the action helpers (`setUser`, `startSession`, `endSession`, `markPaid`, `markRated`, `resetAll`) — never edit state shape ad-hoc from a page.

### Routing & auth gate

`src/App.jsx` is the routing root. The pattern: if `user` is `null` and the current path is not `/onboarding`, redirect to `/onboarding`. The bottom navigation (`BottomNav`) is hidden on `/onboarding` and `/welcome` and shown everywhere else. Add new pages to both the `<Routes>` block and (if they should appear in nav) `BottomNav`'s `items` array.

### Charger data

`src/data/chargers.js` exports `demoChargers` (the static seed) and `getChargerById(id)`. The whole UI reads from this list directly — there is no fetch layer to swap out yet. When real chargers are added, this module is the natural seam.

### Payment formula (custom — do not "fix" to pro-rate)

In `src/pages/Session.jsx`, `calcAmount(totalSec)` uses a deliberately non-linear tier rule taken from product spec:

- Full hours: ₪10 each
- Plus remainder minutes (rounded up): ≤10 min → +₪1.50, ≤30 min → +₪5, otherwise → +₪10

These three reference points (₪1.5/10min, ₪5/30min, ₪10/60min) are the spec, not a bug.

## Conventions specific to this project

- **Hebrew + RTL only.** All UI strings are Hebrew. The root `<html lang="he" dir="rtl">` plus body styles in `src/index.css` flip the whole layout. Do not add English copy or `dir="ltr"` containers unless required for technical content (phone numbers, emails, URLs — see below).
- **LTR escape hatch for technical text.** Phone numbers and emails render in LTR boxes with `dir="ltr"` on the input/value to prevent RTL/digit-shaping issues. Apply the same when adding similar fields.
- **Mobile-first, fixed-width app shell.** The `.app` container is capped at 480px and centered. Pages assume this width — avoid absolute positioning that depends on a wider viewport.
- **No real payment integration.** The "תשלום בביט" button intentionally only shows the owner's phone number in a modal — there is no Bit API call, and product wants it kept that way for now.
- **`alert`/`confirm` are acceptable for the MVP** (e.g. stop-charging confirm). Don't replace them with custom modals unless asked.
- **localStorage is the database.** Bumping the shape of stored state needs a new storage-key suffix (`-v2`) or a migration in `loadState()` — otherwise existing users will hit shape mismatches on load.

## What's intentionally missing

These were called out as out-of-scope for the MVP — don't add them unprompted: real auth, Supabase/backend, Bit/credit-card payments, real maps (the map view is a styled placeholder), real geolocation/distance calc (distances are hardcoded `distanceKm` on each demo charger), booking/reservation logic.
