/**
 * data/image-mappings.ts
 *
 * Auditable image mapping layer for Cheroot Holidays.
 *
 * PURPOSE
 * -------
 * Keeps image provenance separate from tour-package business data so either
 * can be updated independently.
 *
 * REVIEW STATUS VALUES
 * --------------------
 * "unreviewed"  — imported from legacy; no human has confirmed the destination.
 * "candidate"   — filename/visual analysis suggests a destination; not verified.
 * "verified"    — confirmed correct by Cheroot Holidays owner or travel team.
 * "rejected"    — confirmed NOT suitable for production use.
 *
 * DO NOT promote a candidate to "verified" without supporting evidence.
 * DO NOT assign to a package slug unless the owner has approved the match.
 */

export type ReviewStatus = "unreviewed" | "candidate" | "rejected" | "verified";

export type ImageConfidence = "high" | "medium" | "low";

export type LegacyImageMapping = {
  /** Stable unique ID derived from the legacy image inventory. */
  imageId: string;
  /**
   * Relative URL for use in Next.js <Image> src.
   * Must correspond to an actual file in /public.
   */
  publicUrl: string;
  /** Original filename from the WordPress media library. */
  originalFilename: string;
  /** Human-readable destination guess from filename or visual analysis. */
  suggestedDestination: string;
  /** Original image width in pixels. */
  width: number;
  /** Original image height in pixels. */
  height: number;
  /**
   * Package slug this image is associated with.
   * null = unassigned; only set when owner has approved.
   */
  packageSlug: string | null;
  /** Current review status. */
  reviewStatus: ReviewStatus;
  /** Confidence level from the automated analysis. */
  confidence: ImageConfidence;
  /** Evidence basis used to derive the destination suggestion. */
  basis: string;
  /** Optional freeform notes from manual review. */
  notes?: string;
};

/**
 * ⚠️  ALL ENTRIES BELOW ARE CANDIDATES — NOT VERIFIED MATCHES.
 *
 * Review status is "candidate" for images where filename or visual analysis
 * suggests a destination with medium-to-high confidence.
 *
 * Images with low confidence or very small dimensions (< 400 px wide) are
 * marked "unreviewed" and should NOT be used in production until inspected.
 *
 * Action required from Cheroot Holidays owner:
 *  1. Open each image in public/packages/imported/ to verify visually.
 *  2. Change reviewStatus to "verified" once confirmed, or "rejected" if wrong.
 *  3. Set packageSlug to the matching package's slug if it should be used.
 */
export const legacyImageMappings: LegacyImageMapping[] = [
  // ── Thailand ──────────────────────────────────────────────────────────────
  {
    imageId: "IMG-0003",
    publicUrl: "/packages/imported/aerial-view-poda-island-krabi-thailand-335224-1196-1.webp",
    originalFilename: "aerial-view-poda-island-krabi-thailand_335224-1196-1.png",
    suggestedDestination: "Krabi / Poda Island, Thailand",
    width: 236,
    height: 200,
    packageSlug: null,
    reviewStatus: "unreviewed",
    confidence: "high",
    basis: "Destination explicitly named in filename",
    notes: "Thumbnail-sized (236×200). Too small for full-size card images; usable as thumbnail only.",
  },
  {
    imageId: "IMG-0009",
    publicUrl: "/packages/imported/bangkok-thailand-july-14-2019-bhumibol-bridge-1-2-largest-bridge-chao-phraya-river-with-lightup-night-554837-715-1.webp",
    originalFilename: "bangkok-thailand-july-14-2019-bhumibol-bridge-1-2-largest-bridge-chao-phraya-river-with-lightup-night_554837-715-1.png",
    suggestedDestination: "Bangkok, Thailand",
    width: 236,
    height: 200,
    packageSlug: null,
    reviewStatus: "unreviewed",
    confidence: "high",
    basis: "Destination explicitly named in filename",
    notes: "Thumbnail-sized (236×200). Too small for full-size card images.",
  },
  {
    imageId: "IMG-0011",
    publicUrl: "/packages/imported/beautiful-girl-sitting-boat-james-bond-island-phang-nga-thailand-335224-1222-1.webp",
    originalFilename: "beautiful-girl-sitting-boat-james-bond-island-phang-nga-thailand_335224-1222-1.png",
    suggestedDestination: "Phang Nga / James Bond Island, Thailand",
    width: 236,
    height: 200,
    packageSlug: null,
    reviewStatus: "unreviewed",
    confidence: "high",
    basis: "Destination explicitly named in filename",
    notes: "Thumbnail-sized (236×200). Too small for full-size card images.",
  },
  {
    imageId: "IMG-0153",
    publicUrl: "/packages/imported/tropical-beach-landscape-in-thailand-2024-12-06-22-49-55-utc-1.webp",
    originalFilename: "tropical-beach-landscape-in-thailand-2024-12-06-22-49-55-utc-1.jpg",
    suggestedDestination: "Thailand tropical beach",
    width: 1600,
    height: 1066,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "high",
    basis: "Thailand explicitly named in filename; full-resolution landscape image.",
  },
  // ── Kerala ────────────────────────────────────────────────────────────────
  {
    imageId: "IMG-0157",
    publicUrl: "/packages/imported/water-boat-kerala-870x555-1.webp",
    originalFilename: "water-boat-kerala-870x555-1.jpg",
    suggestedDestination: "Kerala backwaters",
    width: 870,
    height: 555,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "high",
    basis: "Kerala explicitly named in filename",
  },
  {
    imageId: "IMG-0158",
    publicUrl: "/packages/imported/wayanad-honeymoon-packages-870x555-1.webp",
    originalFilename: "Wayanad-honeymoon-packages-870x555-1.jpg",
    suggestedDestination: "Wayanad, Kerala",
    width: 870,
    height: 555,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "high",
    basis: "Wayanad honeymoon explicitly named in filename",
  },
  {
    imageId: "IMG-0187",
    publicUrl: "/packages/imported/hd-wallpaper-munnar-bridge-fog-garden-kerala-ksrtc-nature-station-travel.webp",
    originalFilename: "HD-wallpaper-munnar-bridge-fog-garden-kerala-ksrtc-nature-station-travel.jpg",
    suggestedDestination: "Munnar, Kerala",
    width: 800,
    height: 533,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "high",
    basis: "Munnar/Kerala explicitly named in filename",
  },
  {
    imageId: "IMG-0193",
    publicUrl: "/packages/imported/munnar-india-nature-hills-station.webp",
    originalFilename: "munnar-india-nature-hills-station.jpg",
    suggestedDestination: "Munnar, India",
    width: 910,
    height: 607,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "high",
    basis: "Munnar explicitly named in filename",
  },
  {
    imageId: "IMG-0194",
    publicUrl: "/packages/imported/munnar-hillstation-kerala.webp",
    originalFilename: "Munnar_hillstation_kerala.jpg",
    suggestedDestination: "Munnar, Kerala",
    width: 1200,
    height: 744,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "high",
    basis: "Munnar/Kerala explicitly named in filename",
  },
  {
    imageId: "IMG-0433",
    publicUrl: "/packages/imported/29ezcwtmtnm.webp",
    originalFilename: "29ezcwtmtnm.jpg",
    suggestedDestination: "Kerala backwaters",
    width: 1600,
    height: 900,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "medium",
    basis: "Kerala-style backwater scene; filename is not descriptive.",
  },
  {
    imageId: "IMG-0473",
    publicUrl: "/packages/imported/ii0ows5abco.webp",
    originalFilename: "ii0ows5abco.jpg",
    suggestedDestination: "Kerala backwaters",
    width: 1600,
    height: 1068,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "medium",
    basis: "Houseboat/backwater scene; filename is not descriptive.",
  },
  {
    imageId: "IMG-0477",
    publicUrl: "/packages/imported/jqc2noh3u3y.webp",
    originalFilename: "jqc2noh3u3y.jpg",
    suggestedDestination: "Munnar, Kerala",
    width: 1600,
    height: 1084,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "medium",
    basis: "Tea-estate hill landscape consistent with Munnar; verify before publishing.",
  },
  // ── Dubai ─────────────────────────────────────────────────────────────────
  {
    imageId: "IMG-0180",
    publicUrl: "/packages/imported/2jfz2vj06sk.webp",
    originalFilename: "2jfz2vj06sk.jpg",
    suggestedDestination: "Dubai, UAE",
    width: 1600,
    height: 1091,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "medium",
    basis: "Visually resembles the Burj Khalifa/Dubai skyline; verify before publishing.",
  },
  {
    imageId: "IMG-0182",
    publicUrl: "/packages/imported/4neuzu-ynnw.webp",
    originalFilename: "4neuzu-ynnw.jpg",
    suggestedDestination: "Dubai, UAE",
    width: 1600,
    height: 1050,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "medium",
    basis: "Visually resembles Atlantis, The Palm; verify before publishing.",
  },
  {
    imageId: "IMG-0184",
    publicUrl: "/packages/imported/c3zbeazk64q.webp",
    originalFilename: "c3zbeazk64q.jpg",
    suggestedDestination: "Dubai, UAE",
    width: 1600,
    height: 1067,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "medium",
    basis: "Visually resembles Dubai Marina; verify before publishing.",
  },
  {
    imageId: "IMG-0192",
    publicUrl: "/packages/imported/ktivtunp-lw.webp",
    originalFilename: "ktivtunp_lw.jpg",
    suggestedDestination: "Dubai, UAE",
    width: 1600,
    height: 1067,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "medium",
    basis: "Visually resembles Burj Al Arab; verify before publishing.",
  },
  // ── South Korea ───────────────────────────────────────────────────────────
  {
    imageId: "IMG-0143",
    publicUrl: "/packages/imported/seoraksan-mountains-is-covered-by-morning-fog-sunrise-seoul-korea-335224-315-1-1.webp",
    originalFilename: "seoraksan-mountains-is-covered-by-morning-fog-sunrise-seoul-korea_335224-315-1-1.png",
    suggestedDestination: "Seoraksan, South Korea",
    width: 236,
    height: 200,
    packageSlug: null,
    reviewStatus: "unreviewed",
    confidence: "high",
    basis: "Destination explicitly named in filename",
    notes: "Thumbnail-sized (236×200). Too small for full-size card images.",
  },
  {
    imageId: "IMG-0225",
    publicUrl: "/packages/imported/e6xu27-t50.webp",
    originalFilename: "e6xu27_t50.jpg",
    suggestedDestination: "South Korea",
    width: 1600,
    height: 900,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "medium",
    basis: "Traditional Korean street architecture; exact location not verified.",
  },
  // ── Japan ─────────────────────────────────────────────────────────────────
  {
    imageId: "IMG-0222",
    publicUrl: "/packages/imported/1tf8x648bfa.webp",
    originalFilename: "1tf8x648bfa.jpg",
    suggestedDestination: "Japan",
    width: 1600,
    height: 1067,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "medium",
    basis: "Japanese temple/garden imagery; exact location not verified.",
  },
  {
    imageId: "IMG-0250",
    publicUrl: "/packages/imported/ej8pkvhdg-c.webp",
    originalFilename: "ej8pkvhdg_c.jpg",
    suggestedDestination: "Mount Fuji, Japan",
    width: 1600,
    height: 1067,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "medium",
    basis: "Visually resembles Mount Fuji; verify before publishing.",
  },
  {
    imageId: "IMG-0251",
    publicUrl: "/packages/imported/ejvgbyjrwea.webp",
    originalFilename: "ejvgbyjrwea.jpg",
    suggestedDestination: "Kyoto, Japan",
    width: 1600,
    height: 1067,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "medium",
    basis: "Torii gate walkway consistent with Fushimi Inari; verify before publishing.",
  },
  // ── India (other) ─────────────────────────────────────────────────────────
  {
    imageId: "IMG-0434",
    publicUrl: "/packages/imported/3feeabwio2o.webp",
    originalFilename: "3feeabwio2o.jpg",
    suggestedDestination: "Jodhpur, India",
    width: 1600,
    height: 1063,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "medium",
    basis: "Blue-city image consistent with Jodhpur; verify before publishing.",
  },
  {
    imageId: "IMG-0474",
    publicUrl: "/packages/imported/iwmfiinivp4.webp",
    originalFilename: "iwmfiinivp4.jpg",
    suggestedDestination: "Agra, India",
    width: 1600,
    height: 1067,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "medium",
    basis: "Taj Mahal visible; verify before publishing.",
  },
  {
    imageId: "IMG-0512",
    publicUrl: "/packages/imported/zziikfeewnu.webp",
    originalFilename: "zziikfeewnu.jpg",
    suggestedDestination: "Agra, India",
    width: 1600,
    height: 1025,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "medium",
    basis: "Taj Mahal visible; verify before publishing.",
  },
  {
    imageId: "IMG-0489",
    publicUrl: "/packages/imported/pf-rtgtewyc.webp",
    originalFilename: "pf-rtgtewyc.jpg",
    suggestedDestination: "Kedarnath region, India",
    width: 1600,
    height: 1200,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "medium",
    basis: "Himalayan temple image; verify exact temple.",
  },
  {
    imageId: "IMG-0508",
    publicUrl: "/packages/imported/y97sm41-g9k.webp",
    originalFilename: "y97sm41-g9k.jpg",
    suggestedDestination: "Jaipur, India",
    width: 1600,
    height: 1067,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "medium",
    basis: "Hawa Mahal-like façade; verify before publishing.",
  },
  {
    imageId: "IMG-0450",
    publicUrl: "/packages/imported/ctddooabasa.webp",
    originalFilename: "ctddooabasa.jpg",
    suggestedDestination: "Coimbatore region, India",
    width: 1600,
    height: 1064,
    packageSlug: null,
    reviewStatus: "unreviewed",
    confidence: "low",
    basis: "Large Shiva statue, possibly Adiyogi; verify exact location.",
  },
  // ── Egypt ─────────────────────────────────────────────────────────────────
  {
    imageId: "IMG-0242",
    publicUrl: "/packages/imported/boyxzfqpwpu-1.webp",
    originalFilename: "boyxzfqpwpu-1.jpg",
    suggestedDestination: "Egypt",
    width: 1600,
    height: 1066,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "medium",
    basis: "Camel/desert and pyramids-themed photo; exact location not verified.",
  },
  // ── Cambodia ──────────────────────────────────────────────────────────────
  {
    imageId: "IMG-0322",
    publicUrl: "/packages/imported/ey3tc81nft0.webp",
    originalFilename: "ey3tc81nft0.jpg",
    suggestedDestination: "Angkor Wat, Cambodia",
    width: 1600,
    height: 900,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "medium",
    basis: "Visually resembles Angkor Wat; verify before publishing.",
  },
  // ── USA ───────────────────────────────────────────────────────────────────
  {
    imageId: "IMG-0330",
    publicUrl: "/packages/imported/gzxx8lkab7y.webp",
    originalFilename: "gzxx8lkab7y.jpg",
    suggestedDestination: "San Francisco, USA",
    width: 1600,
    height: 900,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "medium",
    basis: "Visually resembles the Golden Gate Bridge; verify before publishing.",
  },
  {
    imageId: "IMG-0336",
    publicUrl: "/packages/imported/hzc5cxricfi.webp",
    originalFilename: "hzc5cxricfi.jpg",
    suggestedDestination: "Los Angeles, USA",
    width: 1600,
    height: 1067,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "medium",
    basis: "Hollywood sign visible; verify before publishing.",
  },
  {
    imageId: "IMG-0381",
    publicUrl: "/packages/imported/pefk7fzxtdk.webp",
    originalFilename: "pefk7fzxtdk.jpg",
    suggestedDestination: "New York City, USA",
    width: 1600,
    height: 1033,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "medium",
    basis: "Statue of Liberty visible; verify before publishing.",
  },
  {
    imageId: "IMG-0403",
    publicUrl: "/packages/imported/tack3nspye0.webp",
    originalFilename: "tack3nspye0.jpg",
    suggestedDestination: "New York City, USA",
    width: 1600,
    height: 1067,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "medium",
    basis: "Times Square-like city scene; verify before publishing.",
  },
  {
    imageId: "IMG-0352",
    publicUrl: "/packages/imported/ksljier2ipa.webp",
    originalFilename: "ksljier2ipa.jpg",
    suggestedDestination: "Niagara Falls",
    width: 1600,
    height: 1067,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "medium",
    basis: "Waterfall image resembles Niagara Falls; verify before publishing.",
  },
  // ── China ─────────────────────────────────────────────────────────────────
  {
    imageId: "IMG-0335",
    publicUrl: "/packages/imported/hwy9r6-yzgm.webp",
    originalFilename: "hwy9r6_yzgm.jpg",
    suggestedDestination: "China (Great Wall)",
    width: 1600,
    height: 1067,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "medium",
    basis: "Great Wall-like fortification; exact location not verified.",
  },
  {
    imageId: "IMG-0351",
    publicUrl: "/packages/imported/korjvkqenvm.webp",
    originalFilename: "korjvkqenvm.jpg",
    suggestedDestination: "Beijing, China",
    width: 1600,
    height: 1200,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "medium",
    basis: "Chinese landmark/gate imagery; verify before publishing.",
  },
  {
    imageId: "IMG-0421",
    publicUrl: "/packages/imported/xzdweems3sa.webp",
    originalFilename: "xzdweems3sa.jpg",
    suggestedDestination: "Xi'an, China",
    width: 1600,
    height: 1042,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "medium",
    basis: "Terracotta Army imagery; verify before publishing.",
  },
  // ── Other international ───────────────────────────────────────────────────
  {
    imageId: "IMG-0226",
    publicUrl: "/packages/imported/e9g1rz-0rlu.webp",
    originalFilename: "e9g1rz-0rlu.jpg",
    suggestedDestination: "Tropical island / possible Maldives",
    width: 1600,
    height: 920,
    packageSlug: null,
    reviewStatus: "unreviewed",
    confidence: "low",
    basis: "Atoll-like aerial image; destination not confirmed.",
  },
  {
    imageId: "IMG-0276",
    publicUrl: "/packages/imported/1k8pwxiryia.webp",
    originalFilename: "1k8pwxiryia.jpg",
    suggestedDestination: "Moscow, Russia",
    width: 1600,
    height: 1067,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "medium",
    basis: "Visually resembles St. Basil's Cathedral; verify before publishing.",
  },
  {
    imageId: "IMG-0376",
    publicUrl: "/packages/imported/nncabldgvia.webp",
    originalFilename: "nncabldgvia.jpg",
    suggestedDestination: "Chefchaouen, Morocco",
    width: 1600,
    height: 1067,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "medium",
    basis: "Blue cityscape consistent with Chefchaouen; verify before publishing.",
  },
  {
    imageId: "IMG-0423",
    publicUrl: "/packages/imported/yam1kmv0sgq.webp",
    originalFilename: "yam1kmv0sgq.jpg",
    suggestedDestination: "Machu Picchu, Peru",
    width: 1600,
    height: 1063,
    packageSlug: null,
    reviewStatus: "candidate",
    confidence: "medium",
    basis: "Visually resembles Machu Picchu; verify before publishing.",
  },
];

// ---------------------------------------------------------------------------
// Helper utilities
// ---------------------------------------------------------------------------

/** Total number of candidate images in the legacy recovery set. */
export const LEGACY_SOURCE_IMAGE_COUNT = 512;

/** Number of candidates selected from the 512 source images for review. */
export const LEGACY_CANDIDATE_COUNT = 41;

/** Returns all mappings with a given review status. */
export function getMappingsByStatus(
  status: ReviewStatus,
): LegacyImageMapping[] {
  return legacyImageMappings.filter((m) => m.reviewStatus === status);
}

/** Returns all verified mappings for a given package slug. */
export function getVerifiedImagesForPackage(
  slug: string,
): LegacyImageMapping[] {
  return legacyImageMappings.filter(
    (m) => m.packageSlug === slug && m.reviewStatus === "verified",
  );
}
