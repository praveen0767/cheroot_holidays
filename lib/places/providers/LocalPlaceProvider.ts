/**
 * LocalPlaceProvider
 *
 * Implements PlaceSearchProvider using the curated local India-first registry.
 */

import type { PlaceSearchProvider } from "./PlaceSearchProvider";
import type { PlaceRecord, PlaceSearchOptions, PlaceSearchResult } from "../types";
import { searchLocalPlaces, getLocalPlaceById } from "../search";

export class LocalPlaceProvider implements PlaceSearchProvider {
  readonly id = "local";
  readonly name = "Cheroot Holidays Local Place Registry";

  async search(query: string, options?: PlaceSearchOptions): Promise<PlaceSearchResult> {
    return searchLocalPlaces(query, options);
  }

  async getById(id: string): Promise<PlaceRecord | null> {
    return getLocalPlaceById(id);
  }

  isAvailable(): boolean {
    return true; // Local dataset is always available
  }
}
