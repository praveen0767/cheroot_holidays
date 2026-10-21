# Cheroot Holidays — Location Intelligence & Enquiry Audit Report

**Date of Audit:** October 2026  
**Auditor:** Principal Search & Recommendation Systems Architect  
**Project:** `D:\cheroot_holidays`  
**Repository:** `https://github.com/praveen0767/cheroot_holidays`

---

## 1. Executive Summary

This audit assesses the state of Cheroot Holidays' travel discovery engine, local place registry, recommendation algorithms, and contextual enquiry pipeline following the implementation of the India-first discovery platform.

All features operate fully in local / offline-first mode without external vendor dependencies or billed third-party credentials. Provider boundaries are cleanly abstracted for future seamless connection.

---

## 2. Core Metrics & Inventory

| Dimension | Metric | Detail / Notes |
|:---|:---|:---|
| **Catalogue Package Count** | **6 packages** | `dubai-deluxe-escape`, `bali-serenity-honeymoon`, `kashmir-snowline-journey`, `goa-coastal-getaway`, `maldives-overwater-retreat`, `kerala-backwaters-trail` |
| **Curated Place Records** | **43 places** | Spans Tier-1 metros, state capitals, hill stations, heritage centers, pilgrimage shrines, and key international gateways |
| **Records with Verified Coordinates** | **43 of 43 (100%)** | Authentic WGS-84 decimal coordinates derived from Survey of India & OpenStreetMap datasets |
| **Fabricated / Estimated Coordinates** | **0 (Strict Zero Tolerance)** | Coordinates are never hallucinated. Places without coordinates omit proximity calculation cleanly |
| **Connected Places Provider** | **LocalPlaceProvider** | Curated deterministic local directory (`data/places/india-places.json`) |
| **Connected Enquiry Provider** | **PreviewEnquiryProvider** | Generates verifiable `CHR-YYYYMMDD-XXXX` references; logs sanitized summary to server console |
| **Automated Test Coverage** | **76 tests passing (100%)** | Unit and integration suites for place search, recommendations, enquiry validation, and homepage flow |

---

## 3. Location Matching & Recommendation Audit

### 3.1 Known Destination Query Example: "Goa" or "Bali"
- **Place Search Resolution:** Resolves to verified canonical record (`Goa, India` / `Bali, Indonesia`).
- **Exact Matching Packages:** Returns 1 exact package (`Goa Coastal Getaway` / `Bali Serenity Honeymoon`).
- **Custom Itinerary Flag:** `showCustomPlanningOption: false`.
- **Recommendations Returned:** 1 exact match + related travel style recommendations.

### 3.2 The Delhi Acceptance Query: "Delhi"
- **Place Search Resolution:** Successfully distinguishes `in-delhi-new` (New Delhi), `in-delhi-nct` (Delhi NCT), and `in-delhi-ncr` (Delhi NCR).
- **Exact Matching Packages:** **0 packages** (truthful; no fake Delhi package is fabricated).
- **Proximity Distance Calculations:**
  - Kashmir: `~650 km (approx. straight-line)`
  - Goa: `~1,500 km (approx. straight-line)`
  - Kerala: `~2,050 km (approx. straight-line)`
- **Truthful Labelling:** Explicitly labelled as `approx. straight-line` distance. Never described as driving distance or transit duration.
- **Custom Itinerary Trigger:** `showCustomPlanningOption: true`.
- **CTA Preserved Context:** Directs to `/contact?destination=Delhi&service=custom-itinerary`.

### 3.3 Unresolved Custom Location Example: "Pachmarhi"
- **Place Search Resolution:** Creates dynamic `unresolved_custom_text` record.
- **Flagging:** Explicitly labelled in suggestion list: *"Custom location — we'll plan around it"*.
- **Coordinate Handling:** Latitude and longitude are omitted; straight-line distance calculation is skipped without crashing.
- **Enquiry Context:** Preserved with `destinationResolved: false` so travel specialists know the place was entered as free text.

---

## 4. Provider Readiness & Seam Verification

| Capability | Current Connected Provider | Production Target | Provider Seam Status |
|:---|:---|:---|:---|
| **Place Search & Geocoding** | `LocalPlaceProvider` (curated static registry) | Google Places API / MapmyIndia | `RemotePlaceProvider` adapter interface defined; toggle via `PLACES_PROVIDER=remote` |
| **Enquiry Notifications** | `PreviewEnquiryProvider` (console logger & preview JSON) | Twilio WhatsApp API / Meta Cloud API | `EnquiryDeliveryProvider` interface defined; toggle via `ENQUIRY_DELIVERY_PROVIDER` |

### Preview-Only Functions
1. **WhatsApp Message Dispatch:** No external HTTP call is sent to Twilio or WhatsApp in preview mode. The UI presents an explicit `[📋 Preview Mode Active]` badge and reference code.
2. **Serverless Rate Limiting:** Rate limiting in development operates via request-level header checks. Redis/KV rate-limiting boundary is documented for production deployment.
3. **External Geocoding Autocomplete:** Autocomplete queries the local curated dataset. No external network request is made during input keystrokes.

---

## 5. QA Verification Checklist

- [x] TypeScript builds cleanly with `npx tsc --noEmit` (0 errors).
- [x] ESLint passes with `npm run lint` (0 errors).
- [x] Test suite executes with `npm test` (76/76 passing across 4 suites).
- [x] Origin and destination fields operate independently in the Trip Planner.
- [x] Travellers stepper `[ − 2 + ]` clamps to 1–30 and syncs with enquiry parameters.
- [x] Travel rhythm strip displays 4 editorial persona cards with genuine photography.
- [x] Delhi acceptance test never dead-ends: shows nearby destinations and bespoke trip CTA.
- [x] Contextual enquiry preserves traveller intent, phone numbers are validated to E.164, and reference codes are deterministically generated.
