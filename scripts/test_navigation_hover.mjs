// Run against a local preview. PLAYWRIGHT_MODULE and PLAYWRIGHT_EXECUTABLE_PATH
// can point to an existing Playwright installation and test browser.
import assert from "node:assert/strict";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined,
});

try {
  for (const reducedMotion of ["no-preference", "reduce"]) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(process.env.NAVIGATION_TEST_URL || "http://127.0.0.1:4173", { waitUntil: "networkidle" });

    const nav = page.getByRole("navigation", { name: "Home pages", exact: true });
    const science = nav.getByRole("link", { name: "cognitive science", exact: true });
    const photography = nav.getByRole("link", { name: "photography", exact: true });
    const toggleFor = (link) => link.locator("..").getByRole("button");

    await science.hover();
    await page.waitForTimeout(850);
    assert.equal(await toggleFor(science).getAttribute("aria-expanded"), "true");
    const before = await photography.boundingBox();

    // The previous branch collapses while the pointer stays at photography's
    // original position. No subsequent mouse action may change the chosen menu.
    const pointer = { x: before.x + before.width / 2, y: before.y + before.height / 2 };
    await page.mouse.move(pointer.x, pointer.y);
    await page.waitForTimeout(1400);
    const after = await photography.boundingBox();
    assert(before.y - after.y > 150, "The test must actually move the neighboring menu");
    assert.equal(await toggleFor(science).getAttribute("aria-expanded"), "false");
    assert.equal(await toggleFor(photography).getAttribute("aria-expanded"), "true",
      "Layout movement must not cancel the selected menu's opening or trigger its closing");
    assert.equal(await nav.locator("button[aria-expanded='true']").count(), 1,
      "Menus passing under a stationary pointer must not open");

    await page.mouse.move(pointer.x + 1, pointer.y + 1);
    await page.waitForTimeout(600);
    assert.equal(await toggleFor(photography).getAttribute("aria-expanded"), "true",
      "Tiny mouse jitter after a layout shift must not change the intended target");

    // Deliberately moving to a different parent still opens it and closes the old one.
    const creative = nav.getByRole("link", { name: "creative", exact: true });
    await creative.hover();
    await page.waitForTimeout(1400);
    assert.equal(await toggleFor(photography).getAttribute("aria-expanded"), "false");
    assert.equal(await toggleFor(creative).getAttribute("aria-expanded"), "true");
    assert.equal(await nav.locator("button[aria-expanded='true']").count(), 1);

    await page.mouse.move(1300, 30);
    await page.waitForTimeout(850);
    assert.equal(await nav.locator("button[aria-expanded='true']").count(), 0,
      "Deliberately leaving the menu must still close hover-opened branches");

    // A click retains its ordinary explicit-open behavior independently of hover.
    await toggleFor(creative).click();
    await page.mouse.move(1300, 30);
    await page.locator("main").click({ position: { x: 1000, y: 10 } });
    await page.waitForTimeout(850);
    assert.equal(await toggleFor(creative).getAttribute("aria-expanded"), "true");
    await toggleFor(creative).click();
    await page.waitForTimeout(500);
    assert.equal(await toggleFor(creative).getAttribute("aria-expanded"), "false");

    assert.deepEqual(errors, []);
    console.log(`Passed ${reducedMotion}: ${Math.round(before.y - after.y)}px layout shift, stationary cursor, jitter, deliberate switching/exit, and click pinning.`);
    await page.close();
  }
} finally {
  await browser.close();
}
