/**
 * RemotePlaceProvider Boundary Adapter
 *
 * Reserve boundary for future external location API (e.g. Google Places, MapmyIndia, Mapbox).
 * Does NOT hard-code or invent any provider URLs, authentication schemes, responses,
 * credentials or business data.
 *
 * When the real provider information arrives:
 * 1. Set PLACES_PROVIDER=remote in .env.local
 * 2. Set PLACES_API_BASE_URL and PLACES_API_KEY
 * 3. Implement the fetch logic in this adapter according to the provider's official documentation.
 */

import type { PlaceSearchProvider } from "./PlaceSearchProvider";
import type { PlaceRecord, PlaceSearchOptions, PlaceSearchResult } from "../types";

export class RemotePlaceProvider implements PlaceSearchProvider {
  readonly id = "remote";
  readonly name = "Remote Places API Provider (Reserved Boundary)";

  private readonly baseUrl: string | undefined;
  private readonly apiKey: string | undefined;

  constructor() {
    this.baseUrl = process.env.PLACES_API_BASE_URL;
    this.apiKey = process.env.PLACES_API_KEY;
  }

  isAvailable(): boolean {
    return Boolean(this.baseUrl && this.apiKey);
  }

  async search(_query: string, _options?: PlaceSearchOptions): Promise<PlaceSearchResult> {
    void _query;
    void _options;
    if (!this.isAvailable()) {
      throw new Error(
        "RemotePlaceProvider is not configured. Please supply PLACES_API_BASE_URL and PLACES_API_KEY or set PLACES_PROVIDER=local.",
      );
    }

    // Boundary seam: When the external provider docs and credentials are provided,
    // call the real endpoint here, map its response to PlaceRecord[] with source: "external_api".
    throw new Error(
      "External place provider credentials detected but provider adapter is pending specification. Falling back to local provider is recommended.",
    );
  }

  async getById(_id: string): Promise<PlaceRecord | null> {
    void _id;
    if (!this.isAvailable()) {
      return null;
    }
    return null;
  }
}
