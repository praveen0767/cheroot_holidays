/** Captures per-section screenshots of the home page at mobile + desktop. */
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3111";
const CHROME =
  process.env.CHROME_PATH ??
  "C:/Program Files/Google/Chrome/Application/chrome.exe";

mkdirSync(".screens", { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });

const viewport = {
  name: process.argv[2] ?? "m",
  width: process.argv[2] === "d" ? 1440 : 390,
  height: process.argv[2] === "d" ? 900 : 844,
};

const page = await browser.newPage();
await page.setViewport({ width: viewport.width, height: viewport.height });
await page.emulateMediaFeatures([
  { name: "prefers-reduced-motion", value: "reduce" },
]);
await page.goto(BASE + "/", { waitUntil: "networkidle0" });

// walk the page so lazy images decode + snap rows fill in
await page.evaluate(async () => {
  const step = window.innerHeight * 0.8;
  for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
    window.scrollTo({ top: y, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 150));
  }
  for (const row of document.querySelectorAll(".snap-row")) {
    row.style.scrollBehavior = "auto";
    row.scrollIntoView({ block: "center", behavior: "instant" });
    await new Promise((r) => setTimeout(r, 200));
    row.scrollLeft = row.scrollWidth;
    await new Promise((r) => setTimeout(r, 300));
    row.scrollLeft = 0;
  }
  await Promise.all(
    [...document.images].map((i) =>
      Promise.race([
        i.decode ? i.decode().catch(() => {}) : Promise.resolve(),
        new Promise((r) => setTimeout(r, 2000)),
      ]),
    ),
  );
  window.scrollTo({ top: 0, behavior: "instant" });
});
await new Promise((r) => setTimeout(r, 400));

// hero + header
await page.screenshot({
  path: `.screens/sec-${viewport.name}-hero.png`,
  clip: { x: 0, y: 0, width: viewport.width, height: Math.min(760, viewport.height + 200) },
});

const sections = await page.$$("section");
const names = ["hero2", "destinations", "why", "packages", "services", "testimonials", "cta"];
for (let i = 1; i < sections.length; i++) {
  const box = await sections[i].boundingBox();
  if (!box) continue;
  const height = Math.min(box.height, 900);
  await page.screenshot({
    path: `.screens/sec-${viewport.name}-${names[i] ?? i}.png`,
    clip: {
      x: 0,
      y: Math.max(0, box.y),
      width: viewport.width,
      height,
    },
  });
}

console.log(`captured ${sections.length} sections at ${viewport.name}`);
await browser.close();
