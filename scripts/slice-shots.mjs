/** Slices the home page into readable vertical segments for visual review. */
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3111";
const CHROME =
  process.env.CHROME_PATH ??
  "C:/Program Files/Google/Chrome/Application/chrome.exe";

mkdirSync(".screens", { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });

const configs = [
  { name: "m", width: 390, height: 844, slice: 1600 },
  { name: "d", width: 1440, height: 900, slice: 1800 },
];

for (const cfg of configs) {
  const page = await browser.newPage();
  await page.setViewport({ width: cfg.width, height: cfg.height });
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  await page.goto(BASE + "/", { waitUntil: "networkidle0" });
  // walk the page so lazy images decode before we capture
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 150));
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

  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  let i = 0;
  for (let y = 0; y < total; y += cfg.slice, i++) {
    await page.screenshot({
      path: `.screens/slice-${cfg.name}-${i}.png`,
      clip: { x: 0, y, width: cfg.width, height: Math.min(cfg.slice, total - y) },
    });
  }
  console.log(`${cfg.name}: ${i} slices, total height ${total}px`);
  await page.close();
}

await browser.close();
