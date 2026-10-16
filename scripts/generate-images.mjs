/**
 * Generates on-brand SVG placeholder artwork for destinations / packages / services.
 * Each card uses a blue-toned gradient + compass orbit + location pin motif derived
 * from the Cheroot logo. Swap these files for real photography any time — the data
 * files already point at these paths.
 *
 * Run: node scripts/generate-images.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const PIN = `
  <g transform="translate(0,0)" fill="#ffffff" fill-opacity="0.92">
    <path d="M0 0c-19-24-30-40-30-57a30 30 0 1 1 60 0c0 17-11 33-30 57z"/>
    <circle cx="0" cy="-57" r="11" fill="#0b3487" fill-opacity="0.9"/>
  </g>`;

function artwork({ w, h, dark, mid, light, title = "Cheroot Holidays", seed = 0 }) {
  const cx = w * (0.68 + (seed % 3) * 0.05);
  const cy = h * (0.3 + (seed % 2) * 0.06);
  const r = Math.min(w, h) * 0.34;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${dark}"/>
      <stop offset="0.55" stop-color="${mid}"/>
      <stop offset="1" stop-color="${light}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.78" cy="0.16" r="0.7">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.4"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#07235a" stop-opacity="0"/>
      <stop offset="1" stop-color="#07235a" stop-opacity="0.55"/>
    </linearGradient>
  </defs>

  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>

  <!-- compass orbits -->
  <g fill="none" stroke="#ffffff" stroke-opacity="0.4" stroke-width="${Math.max(3, w * 0.004)}">
    <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.42}" transform="rotate(-18 ${cx} ${cy})"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${r * 0.78}" ry="${r * 0.98}" transform="rotate(14 ${cx} ${cy})" stroke-opacity="0.24"/>
  </g>
  <circle cx="${cx - r * 0.95}" cy="${cy + r * 0.28}" r="${w * 0.016}" fill="#ffffff" fill-opacity="0.75"/>
  <circle cx="${cx + r * 0.9}" cy="${cy - r * 0.32}" r="${w * 0.011}" fill="#ffffff" fill-opacity="0.6"/>
  <circle cx="${cx}" cy="${cy}" r="${r * 0.55}" fill="#ffffff" fill-opacity="0.12"/>

  <!-- location pin -->
  <g transform="translate(${w * 0.24} ${h * 0.34}) scale(${(w / 1200) * 1.5})">${PIN}</g>

  <!-- layered horizon -->
  <path d="M0 ${h * 0.78} C ${w * 0.3} ${h * 0.7}, ${w * 0.62} ${h * 0.86}, ${w} ${h * 0.74} L ${w} ${h} L 0 ${h} Z" fill="#07235a" fill-opacity="0.22"/>
  <path d="M0 ${h * 0.88} C ${w * 0.35} ${h * 0.8}, ${w * 0.66} ${h * 0.96}, ${w} ${h * 0.86} L ${w} ${h} L 0 ${h} Z" fill="#07235a" fill-opacity="0.34"/>
  <rect y="${h * 0.55}" width="${w}" height="${h * 0.45}" fill="url(#haze)"/>
</svg>
`;
}

function write(rel, svg) {
  const path = join(root, rel);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, svg);
  console.log("wrote", rel);
}

const destinations = [
  { slug: "goa", title: "GOA", sub: "India · Beaches", colors: ["#074a96", "#1a7fd4", "#4cc3f0"] },
  { slug: "dubai", title: "DUBAI", sub: "UAE · Skyline", colors: ["#0b3487", "#2f6fd6", "#f2b06a"] },
  { slug: "bali", title: "BALI", sub: "Indonesia · Rice fields", colors: ["#08615c", "#0f8f83", "#54d6c6"] },
  { slug: "kashmir", title: "KASHMIR", sub: "India · Snow valleys", colors: ["#2749a8", "#4f7ad6", "#bcd6ff"] },
  { slug: "maldives", title: "MALDIVES", sub: "Overwater calm", colors: ["#075e75", "#0e93ad", "#57dcea"] },
  { slug: "kerala", title: "KERALA", sub: "India · Backwaters", colors: ["#0a5a44", "#12805f", "#5fd0a4"] },
];

for (const [i, d] of destinations.entries()) {
  write(
    `public/destinations/${d.slug}.svg`,
    artwork({
      w: 1200,
      h: 1500,
      dark: d.colors[0],
      mid: d.colors[1],
      light: d.colors[2],
      seed: i,
    }),
  );
}

const packages = [
  { slug: "dubai-deluxe-escape", title: "DUBAI", sub: "5N / 6D", colors: ["#0b3487", "#2f6fd6", "#f2b06a"], seed: 1 },
  { slug: "bali-serenity-honeymoon", title: "BALI", sub: "6N / 7D", colors: ["#08615c", "#0f8f83", "#54d6c6"], seed: 2 },
  { slug: "kashmir-snowline-journey", title: "KASHMIR", sub: "5N / 6D", colors: ["#2749a8", "#4f7ad6", "#bcd6ff"], seed: 0 },
  { slug: "goa-coastal-getaway", title: "GOA", sub: "3N / 4D", colors: ["#074a96", "#1a7fd4", "#4cc3f0"], seed: 1 },
  { slug: "maldives-overwater-retreat", title: "MALDIVES", sub: "4N / 5D", colors: ["#075e75", "#0e93ad", "#57dcea"], seed: 2 },
  { slug: "kerala-backwaters-trail", title: "KERALA", sub: "5N / 6D", colors: ["#0a5a44", "#12805f", "#5fd0a4"], seed: 0 },
];

for (const p of packages) {
  write(
    `public/packages/${p.slug}.svg`,
    artwork({
      w: 1200,
      h: 900,
      dark: p.colors[0],
      mid: p.colors[1],
      light: p.colors[2],
      seed: p.seed,
    }),
  );
}

const services = [
  { slug: "flight-booking", title: "FLIGHTS", sub: "Routes & fares", seed: 0 },
  { slug: "hotel-booking", title: "STAYS", sub: "Hotels & resorts", seed: 1 },
  { slug: "visa-assistance", title: "VISA", sub: "Documentation", seed: 2 },
  { slug: "custom-itineraries", title: "ITINERARY", sub: "Day-by-day plans", seed: 0 },
  { slug: "travel-support", title: "SUPPORT", sub: "24/7 assistance", seed: 1 },
];

for (const s of services) {
  write(
    `public/services/${s.slug}.svg`,
    artwork({
      w: 1200,
      h: 800,
      dark: "#07235a",
      mid: "#1250c4",
      light: "#2f86ef",
      seed: s.seed,
    }),
  );
}
