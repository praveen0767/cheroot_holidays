/**
 * PlaceSearchProvider Interface
 *
 * Defines the contract for place discovery providers (local registry or future remote API).
 */

import type { PlaceRecord, PlaceSearchOptions, PlaceSearchResult } from "../types";

export interface PlaceSearchProvider {
  /** Identifier of the provider */
  readonly id: string;
  /** Friendly provider name */
  readonly name: string;
  /** Search for place suggestions matching a query */
  search(query: string, options?: PlaceSearchOptions): Promise<PlaceSearchResult>;
  /** Retrieve place by unique identifier */
  getById(id: string): Promise<PlaceRecord | null>;
  /** Check if this provider is configured and available */
  isAvailable(): boolean;
}
