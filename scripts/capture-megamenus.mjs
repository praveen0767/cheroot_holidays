import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const CHROME =
  process.env.CHROME_PATH ??
  "C:/Program Files/Google/Chrome/Application/chrome.exe";

mkdirSync(".screens/megamenu", { recursive: true });

async function main() {
  console.log("Launching local Chrome via puppeteer-core...");
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log(`Navigating to ${BASE}...`);
  await page.goto(BASE, { waitUntil: "networkidle0" });

  // 1. Destinations Mega Menu at 1280px
  console.log("Testing Destinations Mega Menu at 1280px...");
  await page.click("#nav-destinations-trigger");
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: ".screens/megamenu/destinations-1280.png" });

  // 2. Packages Mega Menu at 1280px
  console.log("Testing Packages Mega Menu at 1280px...");
  await page.click("#nav-packages-trigger");
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: ".screens/megamenu/packages-1280.png" });

  // 3. Honeymoon Mega Menu at 1280px
  console.log("Testing Honeymoon Mega Menu at 1280px...");
  await page.click("#nav-honeymoon-trigger");
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: ".screens/megamenu/honeymoon-1280.png" });

  // 4. Services Mega Menu at 1280px
  console.log("Testing Services Mega Menu at 1280px...");
  await page.click("#nav-services-trigger");
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: ".screens/megamenu/services-1280.png" });

  // 5. Check 1024px viewport (tablet landscape / small laptop)
  console.log("Testing 1024px viewport...");
  await page.setViewport({ width: 1024, height: 768 });
  await page.click("#nav-destinations-trigger");
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: ".screens/megamenu/destinations-1024.png" });

  const destBox = await page.evaluate(() => {
    const el = document.querySelector("#nav-destinations-panel");
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { left: rect.left, right: rect.right, width: rect.width };
  });
  console.log("Destinations 1024px bounding box:", destBox);

  // 6. Check 768px tablet portrait
  console.log("Testing 768px tablet portrait...");
  await page.setViewport({ width: 768, height: 1024 });
  await page.goto(BASE, { waitUntil: "networkidle0" });
  await page.click("button[aria-label='Open menu']");
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: ".screens/megamenu/mobile-drawer-768.png" });

  // 7. Check 390px mobile phone
  console.log("Testing 390px mobile phone...");
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(BASE, { waitUntil: "networkidle0" });
  await page.click("button[aria-label='Open menu']");
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: ".screens/megamenu/mobile-drawer-390.png" });

  console.log("All screenshots captured in .screens/megamenu/ !");
  await browser.close();
}

main().catch((err) => {
  console.error("Puppeteer QA Error:", err);
  process.exit(1);
});
