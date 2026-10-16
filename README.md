# Cheroot Holidays 🧭

Modern travel discovery platform — “travel product + premium agency,” mobile-first
with desktop as an expanded version of the mobile experience.

**UX principle:** Discover → Explore → Trust → Enquire

## Stack

- Next.js 16 (App Router, Turbopack) + TypeScript
- Tailwind CSS v4 (tokens in `app/globals.css` via `@theme`)
- Fonts: Plus Jakarta Sans (display) + Inter (body) via `next/font`
- No other runtime dependencies

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Production:

```bash
npm run build && npm run start
```

## Design system

Palette is derived from the logo (blue compass + location pin + orbit rings):

| Token         | Value      | Use                          |
| ------------- | ---------- | ---------------------------- |
| `brand-900`   | `#07235a`  | Deep travel blue (hero)      |
| `brand-700`   | `#1250c4`  | Primary actions              |
| `brand-500`   | `#2f86ef`  | Bright sky blue              |
| `brand-100`   | `#dcebfe`  | Tint highlights              |
| `surface`     | `#ffffff`  | Page surface                 |
| `surface-soft`| `#f4f8fe`  | Ice/blue-tinted sections     |
| `ink-900`     | `#0b1b33`  | Primary text (text-900)      |
| `ink-600`     | `#566784`  | Muted text (text-600)        |
| `line`        | `#d9e4f3`  | Borders                      |
| `success`     | `#158f5b`  | Booking confirmations        |
| `accent`      | `#f59e0b`  | Ratings, sparing highlights  |

Breakpoints: base 320 · `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 (max-w-7xl = 1280).

## Structure

```
app/                  # routes (home + Phase 3 placeholders for the rest)
components/
  layout/             # Header, MobileMenu, Footer, PageHeader, Logo
  hero/               # Hero, TripPlanner (stepped mobile / bar desktop)
  destinations/       # trending destination section
  packages/           # PackageCard + featured grid
  services/           # home services strip
  trust/              # Why Cheroot
  testimonials/       # review carousel
  home/               # final CTA
  ui/                 # Button, Badge, Container, SectionHeading, Reveal
data/                 # destinations, packages, services, testimonials
lib/                  # constants (nav, contact, offices), utils
scripts/              # image generator + layout QA (see below)
agents.mmd            # agent pipeline methodology (mermaid)
```

Data is separate from presentation — adding 50 packages means editing
`data/packages.ts` only.

## Imagery

`public/{destinations,packages,services}/*.svg` are generated placeholders
(compass orbit + pin motif, blue palette variants). Regenerate with:

```bash
node scripts/generate-images.mjs
```

Swap in real photography at the same paths (the `image` fields in `data/*.ts`)
— no component changes needed.

## QA scripts

With the production server running on :3111:

```bash
node scripts/check-layout.mjs     # overflow, reveals, broken images, console errors
node scripts/capture-sections.mjs # per-section screenshots (m|d)
```

`check-layout` runs every route at 390px and 1440px, scrolls and swipes
carousels, and fails on horizontal overflow, un-triggered reveals, broken
images, failed requests or console errors.

## Contact placeholders

Phone/email in `lib/constants.ts` are placeholders — replace before launch.
