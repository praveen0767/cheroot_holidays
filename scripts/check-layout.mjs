/**
 * Layout QA:
 *  A) normal motion — scrolls the page, asserts every reveal triggered,
 *     and records any 4xx/5xx or console errors
 *  B) reduced motion — checks horizontal overflow (ignoring clipped
 *     decorations and the off-canvas menu) and captures screenshots
 *
 * Run: node scripts/check-layout.mjs
 */
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3111";
const CHROME =
  process.env.CHROME_PATH ??
  "C:/Program Files/Google/Chrome/Application/chrome.exe";

const ROUTES = [
  "/",
  "/packages",
  "/packages/bali-serenity-honeymoon",
  "/packages/dubai-deluxe-escape",
  "/destinations",
  "/destinations/goa",
  "/destinations/kerala",
  "/services",
  "/about",
  "/contact",
];
const VIEWPORTS = [
  { name: "320px", width: 320, height: 600 },
  { name: "375px", width: 375, height: 667 },
  { name: "390px", width: 390, height: 844 },
  { name: "768px", width: 768, height: 1024 },
  { name: "1024px", width: 1024, height: 768 },
  { name: "1280px", width: 1280, height: 800 },
  { name: "1440px", width: 1440, height: 900 },
];

mkdirSync(".screens", { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
let failures = 0;
const fail = (msg) => {
  failures++;
  console.log(`FAIL ${msg}`);
};
const ok = (msg) => console.log(`OK   ${msg}`);

for (const viewport of VIEWPORTS) {
  for (const route of ROUTES) {
    const page = await browser.newPage();
    await page.setViewport({ width: viewport.width, height: viewport.height });

    const bad = [];
    page.on("response", (r) => {
      if (r.status() >= 400) bad.push(`${r.status()} ${r.url().replace(BASE, "")}`);
    });
    page.on("console", (m) => {
      const text = m.text();
      // Ignore Next.js 16 development prefetch notices
      if (text.includes("Next.js encountered URL data")) return;
      if (m.type() === "error") bad.push(`console: ${text.slice(0, 140)}`);
    });

    // Pass A — motion on: scroll everything into view
    await page.goto(BASE + route, { waitUntil: "networkidle0" });
    await page.evaluate(async () => {
      document.documentElement.style.scrollBehavior = "auto";
      const step = window.innerHeight * 0.7;
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo({ top: y, behavior: "instant" });
        await new Promise((r) => setTimeout(r, 120));
      }
      // swipe every horizontal carousel while still in vertical view
      for (const row of document.querySelectorAll(".snap-row")) {
        row.style.scrollBehavior = "auto";
        row.scrollIntoView({ block: "center", behavior: "instant" });
        await new Promise((r) => setTimeout(r, 400));
        const max = row.scrollWidth - row.clientWidth;
        for (let x = 0; x <= max; x += row.clientWidth * 0.6) {
          row.scrollLeft = x;
          await new Promise((r) => setTimeout(r, 120));
        }
        row.scrollLeft = max;
        await new Promise((r) => setTimeout(r, 200));
        row.scrollLeft = 0;
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await new Promise((r) => setTimeout(r, 900));

    const a = await page.evaluate(() => ({
      hidden: document.querySelectorAll(".reveal:not(.is-visible)").length,
      brokenImages: [...document.querySelectorAll("img")].filter(
        (i) => i.complete && i.naturalWidth === 0,
      ).length,
    }));

    const label = `${viewport.name} ${route}`;
    const before = failures;
    if (a.hidden) fail(`${label} — ${a.hidden} reveal(s) never became visible`);
    if (a.brokenImages) fail(`${label} — ${a.brokenImages} broken image(s)`);
    for (const b of bad) fail(`${label} — ${b}`);

    // Pass B — motion reduced: overflow + screenshot
    await page.emulateMediaFeatures([
      { name: "prefers-reduced-motion", value: "reduce" },
    ]);
    await page.reload({ waitUntil: "networkidle0" });
    await new Promise((r) => setTimeout(r, 300));

    const b = await page.evaluate(() => {
      const doc = document.documentElement;
      const clippedByAncestor = (el) => {
        for (let p = el.parentElement; p; p = p.parentElement) {
          const s = getComputedStyle(p);
          if (s.overflow !== "visible" || s.overflowX !== "visible") return true;
          if (s.position === "fixed") return true;
        }
        return false;
      };
      const overflow = [];
      for (const el of document.querySelectorAll("body *")) {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        if (rect.right > window.innerWidth + 1 || rect.left < -1) {
          if (clippedByAncestor(el)) continue;
          overflow.push(
            `<${el.tagName.toLowerCase()}> right=${Math.round(rect.right)} ${String(el.className).slice(0, 70)}`,
          );
        }
      }
      return { scrollWidth: doc.scrollWidth, innerWidth: window.innerWidth, overflow: overflow.slice(0, 6) };
    });

    if (b.scrollWidth > b.innerWidth + 1)
      fail(`${label} — horizontal scroll ${b.scrollWidth} > ${b.innerWidth}`);
    for (const o of b.overflow) fail(`${label} — overflow: ${o}`);

    const name = route === "/" ? "home" : route.replace(/\//g, "-").replace(/^-/, "");
    await page.screenshot({
      path: `.screens/${name}-${viewport.name}.png`,
      fullPage: route === "/",
    });

    if (failures === before) ok(label);
    await page.close();
  }
}

await browser.close();
console.log(failures ? `\n${failures} issue(s) found` : "\nAll checks clean");
process.exit(failures ? 1 : 0);
