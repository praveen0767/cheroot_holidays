# Cheroot Holidays — India-First Travel Discovery & Enquiry Engine

## 1. System Overview

Cheroot Holidays' **Compass Atlas Discovery Engine** provides location intelligence, deterministic place search, coordinate-backed destination recommendations, and an API-ready enquiry pipeline for the Indian travel market.

The platform is built with an offline-first, local provider architecture (`LocalPlaceProvider` and `PreviewEnquiryProvider`) that functions completely without external API keys or vendor endpoints, while establishing strict adapter interfaces ready for real third-party providers.

---

## 2. Local Place Provider & Dataset Provenance

### 2.1 Directory Structure
- `data/places/india-places.json`: Curated registry containing 43 high-priority Indian geographic nodes (metropolitan areas, secondary cities, hill stations, pilgrimage centers, cultural heritage landmarks, and international gateway destinations).
- `data/places/README.md`: Data provenance, schema documentation, and license standards.
- `lib/places/types.ts`: TypeScript contracts for `PlaceRecord`, `PlaceType`, `PlaceSearchResult`, and options.
- `lib/places/normalize.ts`: Deterministic string normalization, diacritic stripping, punctuation filtering, and tokenization.
- `lib/places/search.ts`: Multi-tier deterministic scoring and ranking engine with unresolved text fallback.
- `lib/places/providers/`: Pluggable provider architecture with `LocalPlaceProvider`, `RemotePlaceProvider` (reserved boundary), and `getPlaceProvider()` factory.

### 2.2 Schema Definition
Each place record contains:
```typescript
export type PlaceRecord = {
  id: string;                         // Stable slug, e.g. "in-delhi-new", "in-chennai"
  name: string;                       // Primary administrative / vernacular name
  displayName: string;                // Contextual label, e.g. "New Delhi, Delhi, India"
  placeType: PlaceType;               // "metro" | "city" | "hill_station" | "pilgrimage" | "heritage" | ...
  city?: string;
  district?: string;
  state?: string;
  country: string;                    // "India"
  countryCode: string;                // "IN"
  aliases: string[];                  // Historical, phonetic & vernacular variants
  latitude?: number;                  // WGS-84 decimal coordinate
  longitude?: number;                 // WGS-84 decimal coordinate
  region?: string;                    // "North" | "South" | "West" | "East" | "Northeast"
  searchKeywords: string[];           // Landmarks, attractions, regional terms
  source: "local_curated" | "external_api" | "unresolved_custom_text";
  verificationStatus: "verified" | "curated" | "unresolved_custom_text";
  popularDestination?: boolean;
  associatedDestinationSlug?: string; // Direct map to catalogue destination if present
};
```

### 2.3 Delhi Contextual Disambiguation
The directory explicitly avoids conflating distinct Delhi administrative areas:
- `in-delhi-new`: **New Delhi** (National Capital City, Connaught Place, India Gate)
- `in-delhi-nct`: **Delhi** (National Capital Territory, Old Delhi, Red Fort)
- `in-delhi-ncr`: **Delhi NCR** (National Capital Region, Noida, Gurugram, Ghaziabad)

### 2.4 Provenance & Coordinate Truthfulness Policy
- Coordinate records originate from verified geographic references (Survey of India, OpenStreetMap, GeoNames).
- No coordinate values are ever hallucinated or fabricated.
- Where a location lacks coordinates, proximity calculations are cleanly omitted; the place continues to support exact search and custom itinerary generation.

---

## 3. Search Normalization & Deterministic Ranking

Text search executes via a 10-tier scoring model:
1. **Exact match on primary name**: Score 100
2. **Exact match on displayName**: Score 98
3. **Exact match on alias** (e.g. *Bangalore* → Bengaluru, *Madras* → Chennai, *Bombay* → Mumbai): Score 90
4. **Name starts with query** (prefix match): Score 85
5. **Alias starts with query**: Score 75
6. **DisplayName starts with query**: Score 70
7. **City/State starts with query**: Score 65 / 60
8. **Multi-token prefix match**: Score 55
9. **Substring in name / display / alias**: Score 45 / 40 / 35
10. **Keyword match**: Score 25

**Tie-breakers**: Higher popularity (`popularDestination`), followed by alphabetical ascending `displayName`. Searches never shuffle randomly between identical requests.

---

## 4. Nearest-Destination Recommendation Engine

### 4.1 Geographical Proximity
- Straight-line distance is computed using the spherical Haversine formula over WGS-84 coordinates.
- **Truthful Labelling**: Distances are formatted strictly as `~X km (approx. straight-line)`. They are never represented as driving distance, road travel time, or train duration.
- Distance is never computed if either endpoint lacks authentic coordinates.

### 4.2 Priority Ranking Order
1. Exact package destination match
2. Exact package title match
3. Travel style / category match
4. Geographic proximity (closest catalogue destinations)
5. Stable alphabetical title sort

### 4.3 The Delhi Acceptance Requirement
When a user searches for a destination (such as Delhi) where Cheroot Holidays has no pre-packaged off-the-shelf tour:
1. The search resolves Delhi geographically (`New Delhi, Delhi, India · City`).
2. Exact ready-made package count is 0.
3. No fake packages or estimated prices are rendered.
4. An honest message explains that a pre-built package is not yet listed.
5. Coordinate-ranked nearby catalogue destinations (e.g. Kashmir at ~650 km, Goa at ~1,500 km) are suggested for exploration.
6. A prominent CTA offers: `Plan a customised trip to Delhi`.
7. Clicking the CTA directs the traveller to `/contact?destination=Delhi&service=custom-itinerary`, retaining all search context.

---

## 5. Dual-Input Trip Planner (Origin & Destination)

The hero trip planner separates travel origin from travel destination:
- **Starting from**: Auto-completing origin search input (`PlaceInput` with geocoding suggestions).
- **Where would you like to go?**: Auto-completing destination search input.
- **Travellers**: Direct stepper controls `[ − 2 + ]` bound to 1–30 passengers.
- **Travel Style**: Selector offering Any, Honeymoon, Family, Adventure, Backpacker, Group, Luxury.
- **Action**: `Explore Trips` button navigating to `/packages` with preserved parameters (`origin`, `q`, `passengers`, `category`).

---

## 6. Traveller Personas — Choose Your Travel Rhythm

Located directly below the category discovery strip, four editorial visual cards provide immediate interest-based entry points:
1. **Family Escapes** → `/packages?style=family`
2. **Couple & Honeymoon** → `/packages?category=honeymoon&style=honeymoon`
3. **Backpacking** → `/packages?style=backpacker`
4. **Adventure & Outdoors** → `/packages?style=adventure`

Each card utilizes high-resolution local photography, dark gradient overlays for AA contrast, smooth hover elevation, and responsive horizontal snap-scrolling on mobile.

---

## 7. Contextual Enquiry Engine & Preview Mode

### 7.1 Server-Side Canonical Resolution
The browser never dictates verified package titles, destinations, or prices. When the client submits an enquiry:
- `POST /api/enquiries` validates the payload against an allow-list schema.
- Phone number must comply with E.164 (`/^\+?[1-9]\d{7,14}$/`).
- Passenger count must be 1–30.
- `consent: true` is required.
- Package slug is verified against canonical `packages` in `data/packages.ts`.
- Place IDs are resolved via `getLocalPlaceById`.

### 7.2 Deterministic Request Reference
Every enquiry receives a structured reference code: `CHR-YYYYMMDD-XXXX` (e.g. `CHR-20261021-A8F3`).

### 7.3 Delivery Provider Interface
Defined in `lib/enquiry/provider.ts`:
```typescript
export interface EnquiryDeliveryProvider {
  readonly id: string;
  readonly name: string;
  isAvailable(): boolean;
  send(payload: EnquiryNotificationPayload): Promise<ProviderSendResult>;
}
```

### 7.4 Development Preview vs Production Behavior
- **Development / Preview Mode**: When `ENQUIRY_DELIVERY_PROVIDER=preview` (default) or external credentials are not set, `PreviewEnquiryProvider` logs a sanitized summary to the server console and returns:
  ```json
  {
    "ok": true,
    "preview": true,
    "reference": "CHR-20261021-XXXX",
    "message": "Enquiry received in preview mode! Our team has recorded your request."
  }
  ```
  No external WhatsApp message is dispatched, and the UI displays an explicit preview badge.
- **Production Mode**: If `ENQUIRY_DELIVERY_PROVIDER` is set to a non-preview provider in production without valid credentials, the route fails closed with HTTP 503 (`Service Unavailable`), preventing false claims of message delivery.

---

## 8. Connecting Future External APIs

When external APIs become available, connect them without frontend redesign:

### 8.1 Places API Connection
1. Set `.env.local`:
   ```bash
   PLACES_PROVIDER=remote
   PLACES_API_BASE_URL=https://api.yourprovider.com/v1
   PLACES_API_KEY=your_secret_server_key
   ```
2. Implement `RemotePlaceProvider.search()` in `lib/places/providers/RemotePlaceProvider.ts` according to vendor documentation.
3. The existing route `GET /api/places/search` and `TripPlanner.tsx` will automatically consume remote results.

### 8.2 Message Delivery API Connection
1. Set `.env.local`:
   ```bash
   ENQUIRY_DELIVERY_PROVIDER=vendor_name
   ENQUIRY_API_BASE_URL=https://api.yourvendor.com/v1
   ENQUIRY_API_KEY=your_secret_server_key
   ```
2. Implement `send()` in a concrete `EnquiryDeliveryProvider` class.
3. Wire the provider in `lib/enquiry/PreviewProvider.ts`'s `getEnquiryProvider()` factory.

---

## 9. Running Tests

Execute the automated test suite:
```bash
npm test
```
Runs 76 unit and integration tests covering:
- Deterministic place search, aliases, case-insensitivity, and tokenization.
- Recommendation distance rankings and missing coordinate safety.
- Enquiry payload validation, reference generation, and message formatting.
- Delhi acceptance flow, origin/destination separation, and fallback behavior.
