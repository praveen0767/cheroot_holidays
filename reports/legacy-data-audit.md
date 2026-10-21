# Cheroot Holidays — Legacy Data Recovery, Catalogue Integration & Data Quality Audit Report

**Date of Audit:** October 20, 2026  
**Auditor / Role:** Staff-level Next.js Architect & Senior Data Migration Specialist  
**Project Location:** `D:\cheroot_holidays`  
**Application Stack:** Next.js 16.4.0 (Turbopack, App Router), React 19.3.0, TypeScript 5, Tailwind CSS v4  

---

## 1. Executive Summary

This audit assesses the state of data recovery from the previous WordPress archive, the newly established auditable image mapping data architecture, package data integrity, and the responsive tour catalogue interface for **Cheroot Holidays** (*Explore · Experience · Enjoy*).

### Non-Negotiable Principle of Provenance
The recovered WordPress archive contained media uploads and WP Travel Engine configuration files, but **no authoritative MySQL/WordPress database export**. Therefore, the 512 original media files and the 41 candidate WebP images in `public/packages/imported/` represent an **unverified image candidate pool**, NOT a catalog of tour packages.

In adherence to strict data integrity standards:
1. **No packages were fabricated.** The system renders only the 6 existing starter/demonstration packages, with architecture tested and ready to scale to 100+ genuine packages when provided by the client.
2. **Zero candidates were silently published as verified package images.** All 41 candidates remain in `data/image-mappings.ts` with explicit provenance, confidence scores, and review statuses.
3. **Unverified pricing and ratings are treated honestly.** Where prices or ratings lack verified sign-off, UI components render honest inquiry invitations (*“Request a personalised quote”*) rather than misleading numbers or ₹0.

---

## 2. Image Recovery Inventory & Analysis

| Metric | Count | Details & Provenance |
| :--- | :--- | :--- |
| **Total Legacy WordPress Uploads** | **512** | Extracted from `_cherootholidays.com .zip` (`wp-content/uploads`). No DB relational map. |
| **Candidate Assets Processed** | **41** | Selected for manual review based on destination keywords and visual subject clarity. |
| **Local WebP Assets Available** | **41** | Converted to modern `.webp` and stored in `public/packages/imported/`. |
| **Production Images in Active UI** | **13** | 6 Package SVGs (`public/packages/`), 6 Destination SVGs (`public/destinations/`), 1 Fallback SVG (`public/brand/placeholder-package.svg`). |
| **Directly Verified WebP Mappings** | **0** | Awaiting business owner visual confirmation before assigning to live packages. |
| **Ambiguous / Candidate Mappings** | **35** | Medium-to-high confidence suggestions based on landmarks or filenames. |
| **Unreviewed / Rejected for Cards** | **6** | 4 sub-400px thumbnails (unusable for cards) + 2 low-confidence unconfirmed photos. |

### Assets with Unexpected Dimensions / Sub-400px Thumbnails
The following 4 assets from the legacy archive were thumbnail crops (236×200 px). They are marked `unreviewed` with notes prohibiting their use as full card or hero imagery:
1. `IMG-0003` (`aerial-view-poda-island-krabi-thailand-335224-1196-1.webp`): 236×200 px (9.6 KB)
2. `IMG-0009` (`bangkok-thailand-july-14-2019-bhumibol-bridge-1-2-largest-bridge-chao-phraya-river-with-lightup-night-554837-715-1.webp`): 236×200 px (7.5 KB)
3. `IMG-0011` (`beautiful-girl-sitting-boat-james-bond-island-phang-nga-thailand-335224-1222-1.webp`): 236×200 px (12.9 KB)
4. `IMG-0143` (`seoraksan-mountains-is-covered-by-morning-fog-sunrise-seoul-korea-335224-315-1-1.webp`): 236×200 px (8.1 KB)

### Low Confidence Assets
1. `IMG-0226` (`e9g1rz-0rlu.webp`): 1600×920 px — Aerial atoll landscape. Cannot definitively distinguish Maldives from Lakshadweep or Southeast Asia without client confirmation.
2. `IMG-0450` (`ctddooabasa.webp`): 1600×1064 px — Large Shiva statue. Possible Adiyogi Coimbatore, but unverified.

### Duplicate / Redundant Subject Clusters Detected
- **Kerala Backwaters & Houseboats:** 5 candidates (`IMG-0157`, `IMG-0193`, `IMG-0194`, `IMG-0433`, `IMG-0473`). Multiple shots of similar backwater boats and tea hills.
- **Dubai Skyline & Landmarks:** 4 candidates (`IMG-0180` Burj Khalifa, `IMG-0182` Atlantis, `IMG-0184` Marina, `IMG-0192` Burj Al Arab).
- **Agra / Taj Mahal:** 2 candidates (`IMG-0474`, `IMG-0512`). Redundant viewpoints of Taj Mahal.
- **New York City:** 2 candidates (`IMG-0381` Statue of Liberty, `IMG-0403` Times Square).
- **China Landmarks:** 3 candidates (`IMG-0335` Great Wall, `IMG-0351` Beijing Gate, `IMG-0421` Terracotta Army).

---

## 3. Package Data Architecture & Audit

### Available Package Records
Currently, exactly **6 starter packages** exist in `data/packages.ts`:

| Package Title | Slug | Destination | Category | Current Demo Price | Current Demo Rating | Provenance |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Dubai Deluxe Escape** | `dubai-deluxe-escape` | Dubai | International | ₹64,999 | 4.8 (126 reviews) | Demo / Starter |
| **Bali Serenity Honeymoon** | `bali-serenity-honeymoon` | Bali | International | ₹78,999 | 4.9 (98 reviews) | Demo / Starter |
| **Kashmir Snowline Journey** | `kashmir-snowline-journey` | Kashmir | Domestic | ₹38,999 | 4.7 (154 reviews) | Demo / Starter |
| **Goa Coastal Getaway** | `goa-coastal-getaway` | Goa | Domestic | ₹24,999 | 4.6 (210 reviews) | Demo / Starter |
| **Maldives Overwater Retreat**| `maldives-overwater-retreat`| Maldives | Honeymoon | ₹1,14,999 | 4.9 (61 reviews) | Demo / Starter |
| **Kerala Backwaters Trail** | `kerala-backwaters-trail` | Kerala | Domestic | ₹29,999 | 4.7 (132 reviews) | Demo / Starter |

### Missing Package Information Requiring Business Confirmation
- **Verified Starting Prices:** All 6 listed prices are starter/demonstration figures. Client must confirm seasonal baseline rates before launch.
- **Ratings & Reviews:** The review counts (e.g., 210 for Goa, 154 for Kashmir) and star ratings are demo values.
- **Detailed Day-by-Day Itineraries:** No daily schedules were present in the recovery bundle. The UI now displays an honest message: *“A detailed day-by-day itinerary is available on request. Our travel team will share the latest programme, hotel options, and inclusions tailored to your travel dates.”*
- **Hotel / Meal Inclusions:** Inclusions in the starter data need client verification before contractual publishing.

### Safeguards Implemented in Data Layer
1. **Slug Uniqueness:** `validatePackages()` enforces zero duplicate slugs at runtime.
2. **Price Sanity:** Validates that prices, when provided, are positive numbers (`price > 0`). Non-numeric or zero prices are rejected.
3. **Optional Display Grace:** `PackageCard`, `PackageCatalogue`, and `PackageDetailPage` do not assume prices or ratings exist. If `price` is undefined, the card cleanly displays *“Request a personalised quote”*. If `rating` is undefined, the rating chip is cleanly omitted.
4. **Image Fallback:** If an image fails to load or the path is invalid, `PackageCard` gracefully falls back to `/brand/placeholder-package.svg` without visual breakage or broken image icons.

---

## 4. Destination & Homepage Consistency Audit

### Reconciliation of Destination Counts and Prices
Previously, `data/destinations.ts` contained hardcoded counts and prices that directly contradicted the package catalogue:
- Goa: previously claimed `14 packages, from ₹18,999` (Actual: 1 package, ₹24,999)
- Dubai: previously claimed `11 packages, from ₹54,999` (Actual: 1 package, ₹64,999)
- Bali: previously claimed `9 packages, from ₹62,999` (Actual: 1 package, ₹78,999)
- Kashmir: previously claimed `8 packages, from ₹34,999` (Actual: 1 package, ₹38,999)
- Maldives: previously claimed `6 packages, from ₹98,999` (Actual: 1 package, ₹1,14,999)
- Kerala: previously claimed `12 packages, from ₹27,999` (Actual: 1 package, ₹29,999)

**Fix Implemented:**
- `packageCount` is now dynamically computed via `getPackageCountForDestination(slug)` directly from canonical package records.
- `fromPrice` is now dynamically derived via `getMinPriceForDestination(slug)`.
- `DestinationCard` now checks `destination.fromPrice > 0`. If absent, it renders *“Enquire for quote”*.

---

## 5. Placeholder Business & Contact Information

The following items in `lib/constants.ts` and throughout the application are temporary placeholders that require confirmation from the Cheroot Holidays business owner before production deployment:

1. **Telephone Number:** `+91 98765 43210` (Placeholder)
2. **WhatsApp Contact:** `https://wa.me/919876543210` (Placeholder)
3. **General Inquiries Email:** `hello@cherootholidays.com` (Placeholder)
4. **Office Addresses:** Listed branches in Chennai, Coimbatore, Erode, and Tirupur need physical street addresses and contact personnel.

---

## 6. Verification and Quality Gates

| Verification Gate | Result | Notes |
| :--- | :--- | :--- |
| **TypeScript Check (`npx tsc --noEmit`)** | **PASSED** | 0 type errors across all files and routes. |
| **Production Build (`next build`)** | **PASSED** | Compiled in 1.2s via Turbopack; 29 static routes prerendered cleanly. |
| **Image Path Resolution (41 Candidates)** | **PASSED** | 100% of candidate paths resolve to valid WebP files in `public/packages/imported/`. |
| **Package Image Resolution (6 Packages)** | **PASSED** | 100% of package image paths resolve to valid files. |
| **Destination Image Resolution (6 Dests)**| **PASSED** | 100% of destination SVG paths resolve to valid files. |
| **Layout QA & Responsive Viewports** | **PASSED** | Puppeteer audited 10 routes across 7 viewports (320px, 375px, 390px, 768px, 1024px, 1280px, 1440px): 0 horizontal overflows, 0 broken images, 0 un-triggered reveals. |

---

## 7. Next Steps for Business Owner

1. **Review Candidate Imagery:** Review the 41 candidate WebP images in `public/packages/imported/` and change `reviewStatus: "verified"` for confirmed images in `data/image-mappings.ts`.
2. **Provide Real Contact Details:** Replace placeholders in `lib/constants.ts` with authentic phone, email, and WhatsApp numbers.
3. **Confirm Starter Package Pricing & Itineraries:** Update `data/packages.ts` with confirmed rates and detailed day-by-day itineraries.
