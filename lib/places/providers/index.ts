/**
 * Place Provider Factory
 *
 * Resolves the configured PlaceSearchProvider.
 * Defaults to LocalPlaceProvider (offline-first, curated India directory).
 * Gracefully falls back to local provider if remote provider is unconfigured or unavailable.
 */

import type { PlaceSearchProvider } from "./PlaceSearchProvider";
import { LocalPlaceProvider } from "./LocalPlaceProvider";
import { RemotePlaceProvider } from "./RemotePlaceProvider";

export function getPlaceProvider(): PlaceSearchProvider {
  const providerType = (process.env.PLACES_PROVIDER || "local").toLowerCase();

  if (providerType === "remote") {
    const remote = new RemotePlaceProvider();
    if (remote.isAvailable()) {
      return remote;
    }
    // If remote is specified but credentials/URL are missing, fall back to local with a server warning
    if (process.env.NODE_ENV !== "test") {
      console.warn(
        "[places] PLACES_PROVIDER is set to 'remote' but credentials are not configured. Falling back to LocalPlaceProvider.",
      );
    }
    return new LocalPlaceProvider();
  }

  return new LocalPlaceProvider();
}

export * from "./PlaceSearchProvider";
export * from "./LocalPlaceProvider";
export * from "./RemotePlaceProvider";
