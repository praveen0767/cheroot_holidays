# Cheroot Holidays — India-First Place Directory

## 1. Overview & Purpose
This curated registry powers the **Compass Atlas Travel Discovery Engine** for Cheroot Holidays. It provides offline-first, deterministic location intelligence for Indian origins, destinations, hill stations, heritage centers, and key international gateways without requiring an active external geocoding API.

## 2. Record Schema
Each place is defined with:
- `id`: Stable, immutable slug (e.g. `in-delhi-new`, `in-bengaluru`, `in-chennai`, `in-kashmir`, `intl-bali`).
- `name`: Primary vernacular / administrative name.
- `displayName`: Formatted hierarchical title (e.g. `New Delhi, Delhi, India`).
- `placeType`: Classification tag:
  - `metro`: Tier-1 metropolitan hubs.
  - `city`: Major commercial and urban centers.
  - `union_territory`: Union territories like Delhi NCT.
  - `destination`: Primary holiday / touring destination.
  - `hill_station`: Mountain holiday retreats (e.g. Manali, Munnar, Ooty).
  - `pilgrimage`: Spiritual and religious heritage centers (e.g. Varanasi, Amritsar, Rameswaram, Tirupati).
  - `heritage`: UNESCO / archaeological monuments (e.g. Hampi, Agra, Mysuru).
  - `international_destination`: Key outbound holiday hubs (Dubai, Bali, Maldives).
- `country` & `countryCode`: Sovereign country (`India`, `IN` or international ISO code).
- `aliases`: Recognized alternate spellings, historical names, and regional variants (e.g. `Bengaluru` ↔ `Bangalore`, `Mumbai` ↔ `Bombay`, `Chennai` ↔ `Madras`).
- `latitude` & `longitude`: Authentic WGS-84 decimal coordinates for distance calculation.
- `region`: Geographical cluster (`North`, `South`, `West`, `East`, `Northeast`, `International`).
- `searchKeywords`: Landmarks and travel intents associated with the place.
- `source`: `"local_curated"` (distinguishable from future `"external_api"` results).
- `verificationStatus`: `"verified"` for checked coordinates.
- `associatedDestinationSlug`: Direct canonical map to `data/destinations.ts` if a catalog match exists (`goa`, `kashmir`, `kerala`, `dubai`, `bali`, `maldives`).

## 3. Data Provenance & Coordinate Standards
- **Coordinates:** Derived from authoritative geographic reference datasets (Survey of India, OpenStreetMap, and GeoNames public datasets).
- **Proximity Calculations:** All proximity measurements use the spherical Earth Haversine formula to compute straight-line distance in kilometers.
- **Strict Truthfulness Policy:**
  - Distances are explicitly labelled as straight-line distance.
  - Never described as driving distance, train travel time, or flight duration.
  - Coordinates are NEVER fabricated or hallucinated for unverified localities.
  - If a place record lacks coordinates, proximity ranking is gracefully omitted while exact and keyword search continues to function normally.

## 4. Delhi Distinctions
The directory explicitly distinguishes between:
1. `in-delhi-new`: **New Delhi**, India's national capital city (Rashtrapati Bhavan, India Gate, Connaught Place).
2. `in-delhi-nct`: **Delhi (NCT)**, National Capital Territory comprising Old Delhi, Red Fort, Qutub Minar.
3. `in-delhi-ncr`: **Delhi NCR**, National Capital Region spanning satellite urban centers (Noida, Gurgaon/Gurugram, Faridabad, Ghaziabad).

## 5. Extensibility & Future API Upgrade
When an external geocoding provider (such as Google Places, MapmyIndia, or Mapbox) is connected:
1. Implement the `PlaceSearchProvider` adapter in `lib/places/providers/`.
2. Configure `PLACES_PROVIDER=remote` in `.env.local`.
3. The UI seamlessly consumes both local and remote providers without frontend architectural changes.
