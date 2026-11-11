// The top bars (src/components/site/site-bars.tsx): the site bar's worlds, the section bars' drop-downs and
// breadcrumbs. Run against a local preview (NAVIGATION_TEST_URL, default http://127.0.0.1:4173). PLAYWRIGHT_MODULE and
// PLAYWRIGHT_EXECUTABLE_PATH can point to an existing Playwright installation and test browser.
import assert from "node:assert/strict";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.NAVIGATION_TEST_URL || "http://127.0.0.1:4173";
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined });

const visible = (locator) => locator.evaluate((element) => {
  const style = getComputedStyle(element);
  return style.display !== "none" && style.visibility === "visible" && Number(style.opacity) > 0.9;
});

try {
  for (const reducedMotion of ["no-preference", "reduce"]) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));

    // The site bar: the four worlds, none current on the front door, the right one current inside a section.
    await page.goto(base + "/", { waitUntil: "networkidle" });
    const site = page.getByRole("navigation", { name: "Site", exact: true });
    assert.deepEqual(await site.getByRole("link").allTextContents(), ["science", "photography", "creative", "contact"]);
    assert.equal(await site.locator('[aria-current="page"]').count(), 0, "Nothing is current on the front door");
    await page.goto(base + "/cognitive-science/publications", { waitUntil: "networkidle" });
    assert.equal(await site.locator('[aria-current="page"]').innerText(), "science");
    await page.goto(base + "/venture", { waitUntil: "networkidle" });
    assert.equal(await site.locator('[aria-current="page"]').innerText(), "creative", "Venture belongs to creative");

    // Drop-downs: only for pages with sub-pages, never for blocks within a page (#anchors).
    await page.goto(base + "/cognitive-science/publications", { waitUntil: "networkidle" });
    const section = page.getByRole("navigation", { name: "cognitive science pages", exact: true });
    const item = (label) => section.locator(".site-nav-item").filter({ has: page.getByRole("link", { name: label, exact: true }) });
    assert.equal(await item("projects").locator(".site-nav-drop").count(), 1, "projects has sub-pages");
    for (const label of ["about", "resources", "publications"]) {
      assert.equal(await item(label).locator(".site-nav-drop").count(), 0, `${label} has no drop-down (no sub-pages)`);
    }
    assert.equal(await page.locator(".site-nav-drop a[href*='#']").count(), 0, "No drop-down lists a block within a page");

    // Hover opens it; the pointer can cross the gap into it; moving away closes it.
    const projects = item("projects");
    const drop = projects.locator(".site-nav-drop");
    assert.equal(await visible(drop), false, "Closed at rest");
    await projects.getByRole("link", { name: "projects", exact: true }).hover();
    await page.waitForTimeout(400);
    assert.equal(await visible(drop), true, "Opens on hover");
    assert.deepEqual(await drop.getByRole("link").allTextContents(), ["the extended language network", "cortex", "tidy tuesday"]);
    const parent = await projects.getByRole("link", { name: "projects", exact: true }).boundingBox();
    const first = await drop.getByRole("link").first().boundingBox();
    await page.mouse.move(parent.x + parent.width / 2, parent.y + parent.height + 6, { steps: 4 });
    await page.mouse.move(first.x + 10, first.y + first.height / 2, { steps: 4 });
    await page.waitForTimeout(300);
    assert.equal(await visible(drop), true, "Stays open while the pointer crosses into it");
    if (reducedMotion === "reduce") {
      assert.equal(await drop.evaluate((element) => getComputedStyle(element).transitionDuration.split(",").every((d) => parseFloat(d) === 0)), true,
        "No animation with reduced motion");
    }
    await page.mouse.move(40, 600);
    await page.waitForTimeout(400);
    assert.equal(await visible(drop), false, "Closes when the pointer leaves");

    // Keyboard: tabbing onto the page opens its drop-down, and the next Tab reaches its first sub-page.
    await projects.getByRole("link", { name: "projects", exact: true }).focus();
    await page.waitForTimeout(300);
    assert.equal(await visible(drop), true, "Opens for keyboard focus");
    await page.keyboard.press("Tab");
    assert.equal(await page.evaluate(() => document.activeElement?.textContent), "the extended language network");

    // Breadcrumbs: the whole path, the page you are on last (and marked current); an about page shows only its section.
    await page.goto(base + "/cognitive-science/projects/cortex", { waitUntil: "networkidle" });
    assert.equal((await page.locator(".site-section-name").innerText()).replace(/\s+/g, " "), "cognitive science / projects / cortex");
    assert.equal(await page.locator('.site-section-name [aria-current="page"]').innerText(), "cortex");
    await page.goto(base + "/cognitive-science/about", { waitUntil: "networkidle" });
    assert.equal((await page.locator(".site-section-name").innerText()).trim(), "cognitive science");
    await page.goto(base + "/venture/trails/mount-washington", { waitUntil: "networkidle" });
    assert.equal((await page.locator(".site-section-name").innerText()).replace(/\s+/g, " "), "creative / venture / northeast 115 / Mount Washington");

    // Creative: projects has its drop-down, journal is a single page.
    await page.goto(base + "/creative", { waitUntil: "networkidle" });
    const creative = page.getByRole("navigation", { name: "creative pages", exact: true });
    assert.equal(await creative.locator(".site-nav-item").filter({ has: page.getByRole("link", { name: "projects", exact: true }) }).locator(".site-nav-drop a").count(), 3);
    assert.equal(await creative.locator(".site-nav-item").filter({ has: page.getByRole("link", { name: "journal", exact: true }) }).locator(".site-nav-drop").count(), 0);

    assert.deepEqual(errors, []);
    console.log(`Passed ${reducedMotion}: site bar, drop-downs (pages only, hover, gap, leave, keyboard), breadcrumbs, creative.`);
    await page.close();
  }

  // Phones: the pages wrap under the section's name, drop-downs are not shown, nothing scrolls sideways.
  const phone = await browser.newPage({ viewport: { width: 390, height: 844 } });
  for (const path of ["/cognitive-science/about", "/creative", "/venture"]) {
    await phone.goto(base + path, { waitUntil: "networkidle" });
    assert(await phone.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `No sideways scroll on ${path}`);
    assert(await phone.locator(".site-nav-drop").evaluateAll((drops) => drops.every((d) => getComputedStyle(d).display === "none")), `No drop-downs on phones: ${path}`);
  }
  await phone.close();
  console.log("Passed phone: wrapping bars, no drop-downs, no sideways scroll.");
} finally {
  await browser.close();
}
