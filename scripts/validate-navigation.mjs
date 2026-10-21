/**
 * COMPASS ATLAS — Navigation Validation & Route QA
 *
 * Verifies that all navigation paths, mega-menu links, category query params,
 * and service anchors resolve correctly against the running application.
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

const ROUTES_TO_TEST = [
  // Primary Navigation
  { path: "/", description: "Home / Logo target" },
  { path: "/about", description: "About Page" },
  { path: "/contact", description: "Contact Page / Plan a Trip default" },
  { path: "/destinations", description: "Destinations Index" },
  { path: "/packages", description: "Packages Index / View all" },
  { path: "/services", description: "Services Index" },

  // Category Filtering Routes
  { path: "/packages?category=international", description: "Packages: International category" },
  { path: "/packages?category=domestic", description: "Packages: Domestic (India) category" },
  { path: "/packages?category=honeymoon", description: "Packages: Honeymoon category" },

  // Query Context Routes (Contact / Enquiry)
  { path: "/contact?interest=honeymoon", description: "Contact: Honeymoon enquiry" },
  { path: "/contact?interest=custom-trip", description: "Contact: Custom trip enquiry" },
  { path: "/contact?service=visa-assistance", description: "Contact: Visa assistance service" },
  { path: "/contact?service=flight-booking", description: "Contact: Flight booking service" },

  // Canonical Destination Detail Pages
  { path: "/destinations/goa", description: "Destination: Goa" },
  { path: "/destinations/dubai", description: "Destination: Dubai" },
  { path: "/destinations/bali", description: "Destination: Bali" },
  { path: "/destinations/kashmir", description: "Destination: Kashmir" },
  { path: "/destinations/maldives", description: "Destination: Maldives" },
  { path: "/destinations/kerala", description: "Destination: Kerala" },

  // Canonical Package Detail Pages
  { path: "/packages/dubai-deluxe-escape", description: "Package: Dubai Deluxe Escape" },
  { path: "/packages/bali-serenity-honeymoon", description: "Package: Bali Serenity Honeymoon" },
  { path: "/packages/kashmir-snowline-journey", description: "Package: Kashmir Snowline Journey" },
  { path: "/packages/goa-coastal-getaway", description: "Package: Goa Coastal Getaway" },
  { path: "/packages/maldives-overwater-retreat", description: "Package: Maldives Overwater Retreat" },
  { path: "/packages/kerala-backwaters-trail", description: "Package: Kerala Backwaters Trail" },
];

async function runValidation() {
  console.log(`\n============================================================`);
  console.log(`🧭 CHEROOT HOLIDAYS — COMPASS ATLAS ROUTE QA`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`============================================================\n`);

  let passed = 0;
  let failed = 0;

  for (const route of ROUTES_TO_TEST) {
    const url = `${BASE_URL}${route.path}`;
    try {
      const res = await fetch(url, { method: "GET" });
      if (res.status === 200) {
        console.log(`  ✓ [200 OK]  ${route.path.padEnd(42)} — ${route.description}`);
        passed++;
      } else {
        console.error(`  ✗ [FAIL ${res.status}] ${route.path.padEnd(42)} — ${route.description}`);
        failed++;
      }
    } catch (err) {
      console.error(`  ✗ [ERR]      ${route.path.padEnd(42)} — ${err.message}`);
      failed++;
    }
  }

  // Also test services page for all anchor IDs
  console.log(`\n--- Validating Service Anchors on /services ---`);
  try {
    const servicesRes = await fetch(`${BASE_URL}/services`);
    const servicesHtml = await servicesRes.text();
    const serviceSlugs = [
      "flight-booking",
      "hotel-booking",
      "visa-assistance",
      "custom-itineraries",
      "travel-support",
    ];

    for (const slug of serviceSlugs) {
      if (servicesHtml.includes(`id="${slug}"`)) {
        console.log(`  ✓ [ANCHOR]  id="${slug}" found on /services`);
        passed++;
      } else {
        console.error(`  ✗ [MISSING] id="${slug}" not found on /services`);
        failed++;
      }
    }
  } catch (err) {
    console.error(`  ✗ [ERR] Failed to verify /services HTML: ${err.message}`);
    failed++;
  }

  console.log(`\n============================================================`);
  console.log(`SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log(`============================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runValidation();
