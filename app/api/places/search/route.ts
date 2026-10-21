/**
 * GET /api/places/search
 *
 * India-first place search API endpoint.
 * Accepts: ?q=<query>&limit=<n>&country=<ISO2>&international=<bool>
 * Returns: PlaceSearchResult JSON
 *
 * Pluggable via getPlaceProvider() — defaults to LocalPlaceProvider (deterministic local registry).
 * Ready for future remote provider without changing the endpoint contract.
 */

import { NextResponse, type NextRequest } from "next/server";
import { getPlaceProvider } from "@/lib/places/providers";
import { LocalPlaceProvider } from "@/lib/places/providers/LocalPlaceProvider";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const q = (searchParams.get("q") ?? "").trim();
  const limitRaw = Number(searchParams.get("limit") ?? "6");
  const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, 20) : 6;
  const countryCode = searchParams.get("country")?.trim().toUpperCase() || undefined;
  const includeInternational = searchParams.get("international") === "true";
  const localeParam = searchParams.get("locale") || searchParams.get("lang");
  const locale = localeParam === "ta" ? "ta" : "en";

  try {
    const provider = getPlaceProvider();
    const result = await provider.search(q, {
      limit,
      countryCode: includeInternational ? undefined : countryCode,
      locale,
    });

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
      },
    });
  } catch (err: unknown) {
    console.error("[api/places/search] Error during place search, falling back to local provider:", err);
    // Graceful fallback to local provider to ensure high availability
    const fallbackProvider = new LocalPlaceProvider();
    const fallbackResult = await fallbackProvider.search(q, {
      limit,
      countryCode: includeInternational ? undefined : countryCode,
      locale,
    });

    return NextResponse.json(fallbackResult, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }
}
