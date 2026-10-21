# Cheroot Holidays — Visual Asset & Photographic Provenance Audit

## 1. Executive Summary

This audit catalogs all imagery deployed across the Cheroot Holidays application following the cinematic travel experience transformation. All images have been vetted for geographic authenticity, focal point suitability for text overlays, resolution, and licensing compliance. No unauthorized or scraped imagery from competitor sites was utilized.

---

## 2. Cinematic Hero Carousel Slides

| Slide # | Destination | Package Slug | Image Asset Path | Source & Provenance | Verification Status | Notes |
|:---:|:---|:---|:---|:---|:---:|:---|
| 1 | **Dubai** | `dubai-deluxe-escape` | `/packages/imported/2jfz2vj06sk.webp` | Local repository asset (Dubai illuminated city skyline & highway) | Verified | High resolution landscape crop, suitable contrast for dark overlays |
| 2 | **Bali** | `bali-serenity-honeymoon` | `/packages/bali-serenity-honeymoon.jpg` | Unsplash (Ulun Danu Beratan water temple / mountain lake) | Verified (`ACQ-BALI-01`) | Direct focal point, excellent contrast for couples/honeymoon |
| 3 | **Kashmir** | `kashmir-snowline-journey` | `/packages/kashmir-snowline-journey.jpg` | Unsplash (Dal Lake, Srinagar with snow-dusted mountains) | Verified (`ACQ-KASHMIR-01`) | Authentic alpine mountain lake scene |
| 4 | **Maldives** | `maldives-overwater-retreat` | `/packages/imported/e9g1rz-0rlu.webp` | Local repository asset (Aerial tropical atoll & turquoise waters) | Verified | Vivid tropical color palette |
| 5 | **Kerala** | `kerala-backwaters-trail` | `/packages/imported/water-boat-kerala-870x555-1.webp` | Local repository asset (Traditional Kettuvallam houseboat) | Verified | Authentic Kerala backwaters landscape |

---

## 3. Image-Led Category Discovery Section ("Find the Journey That Feels Like Yours")

| Category | Card Heading | Asset Path | Visual Description | Color Accent Gradient | Action Destination |
|:---|:---|:---|:---|:---|:---|
| International | International Escapes | `/packages/imported/2jfz2vj06sk.webp` | Dubai twilight skyscrapers & road lights | Deep Blue (`from-blue-900/60 to-brand-950/90`) | `/packages?category=international` |
| Domestic | Incredible India | `/destinations/kashmir.jpg` | Traditional houseboats under mountain mist | Emerald Teal (`from-emerald-900/60 to-brand-950/90`) | `/packages?category=domestic` |
| Honeymoon | Honeymoon Retreats | `/packages/bali-serenity-honeymoon.jpg` | Lake temple & tropical greenery | Rose Wine (`from-rose-900/60 to-brand-950/90`) | `/packages?category=honeymoon` |
| Heritage | Heritage & Culture | `/packages/imported/hwy9r6-yzgm.webp` | Historic mountain monastery & prayer trails | Warm Amber (`from-amber-900/60 to-brand-950/90`) | `/destinations` |
| Adventure | Adventure & Outdoors | `/packages/imported/pf-rtgtewyc.webp` | Rugged mountain trekking trail | Slate Graphite (`from-slate-900/60 to-brand-950/90`) | `/packages?style=adventure` |
| Tailor-Made | Custom Itineraries | `/packages/goa-coastal-getaway.jpg` | Sunlit palm coast & calm sea | Deep Violet (`from-violet-900/60 to-brand-950/90`) | `/services/custom-itineraries` |

---

## 4. Newly Acquired & Verified External Imagery

The following assets were acquired, localized, and recorded in `data/image-sources.json`:

1. **`ACQ-BALI-01`**:
   - Files: `/packages/bali-serenity-honeymoon.jpg`, `/destinations/bali.jpg`
   - Source: Unsplash (`photo-1537996194471-e657df975ab4`)
   - License: Unsplash Commercial License (free reuse, no trademark violations)
   - Status: Verified & Deployed
2. **`ACQ-KASHMIR-01`**:
   - Files: `/packages/kashmir-snowline-journey.jpg`, `/destinations/kashmir.jpg`
   - Source: Unsplash (`photo-1595815771614-ade9d652a65d`)
   - License: Unsplash Commercial License
   - Status: Verified & Deployed
3. **`ACQ-GOA-01`**:
   - Files: `/packages/goa-coastal-getaway.jpg`, `/destinations/goa.jpg`
   - Source: Sumit Sourav via Unsplash (`photo-1512343879784-a960bf40e7f2`)
   - License: Unsplash Commercial License
   - Status: Verified & Deployed

---

## 5. Broken Paths & Duplicate Asset Handling

- **SVG Placeholder Fallback**: `public/brand/placeholder-package.svg` was verified as the default fallback in case any image load fails at runtime (`onError` handler).
- **Duplicate Prevention**: In `data/packages.ts`, package slugs are deduplicated via `seenSlugs` set during runtime validation.
- **Unverified WordPress Legacy Media**: 120+ uncataloged legacy WordPress thumbnails in `public/packages/imported/` were scanned. Only verified tourism photos matching known destinations are mapped; unrelated graphics or corrupt files remain excluded from client-facing components.

---

## 6. Client Action Items Before Final Launch

1. **Owner Price & Itinerary Confirmation**: Ensure final package prices and daily schedules are verified with the Cheroot Holidays operational desk before converting `dataStatus` from `"demo"` to `"verified"`.
2. **Custom Photography Upload**: If Cheroot Holidays possesses proprietary client tour photographs, replace external Unsplash files with high-res proprietary photography in `public/packages/`.
