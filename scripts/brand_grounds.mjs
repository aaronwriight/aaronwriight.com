// Captures the site's contour background, with nothing else on the page, as the grounds that
// scripts/brand_package.py lays the brand cards on. Run against a local preview:
//
//   BRAND_GROUNDS_URL=http://127.0.0.1:4173 node scripts/brand_grounds.mjs
//
// PLAYWRIGHT_MODULE and PLAYWRIGHT_EXECUTABLE_PATH can point to an existing Playwright installation and test browser.
// Writes images/brand/ground-<width>x<height>.png; the grounds only change when the background does.
import path from "node:path";
import { fileURLToPath } from "node:url";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const url = process.env.BRAND_GROUNDS_URL || "http://127.0.0.1:4173";
// [width, height, scale] in CSS pixels: the sharing card, the email header (shown at half size), the square avatar, the
// LinkedIn banner, and the Bluesky banner (drawn at half size and doubled, so its contours match the others' density).
const sizes = [[1200, 630, 1], [1200, 300, 1], [1080, 1080, 1], [1584, 396, 1], [1500, 500, 2]];

const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined });
try {
  for (const [width, height, scale] of sizes) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: scale, colorScheme: "light", reducedMotion: "reduce" });
    await page.goto(url, { waitUntil: "networkidle" });
    await page.addStyleTag({ content: "body * { visibility: hidden !important; } .topo-background { visibility: visible !important; } nextjs-portal { display: none !important; }" });
    // topo-background.tsx loads its texture when the browser is idle and marks the page once it has painted.
    await page.waitForFunction(() => document.documentElement.getAttribute("data-topo") === "on", null, { timeout: 15000 });
    await page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))));
    const file = path.join(root, "images", "brand", `ground-${width * scale}x${height * scale}.png`);
    await page.screenshot({ path: file });
    console.log(`wrote ${path.relative(root, file)}`);
    await page.close();
  }
} finally {
  await browser.close();
}
