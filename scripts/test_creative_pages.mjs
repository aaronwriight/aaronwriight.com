// Local UI regression checks. External traffic is blocked and email APIs are mocked.
// Run with the same PLAYWRIGHT_MODULE / PLAYWRIGHT_EXECUTABLE_PATH as test_navigation_hover.mjs.
import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const catalog = JSON.parse(await readFile(new URL("../content/photography/published.json", import.meta.url), "utf8"));
const PHOTO = "/frame-it-wright-photography";
// Photography pages are canonical on frameitwright.com, at the same path without the section prefix.
const canonicalFor = path => path.startsWith(PHOTO) ? `https://frameitwright.com${path.slice(PHOTO.length)}`.replace(/\/$/, "") || "https://frameitwright.com" : `https://aaronwriight.com${path}`;
const base = process.env.CREATIVE_TEST_URL || "http://127.0.0.1:4184";
const artifacts = process.env.CREATIVE_TEST_ARTIFACTS || "/private/tmp/frameitwright-creative-checks";
await mkdir(artifacts, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined });
const errors = [];
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 } });
    await context.route("**/*", route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
    const page = await context.newPage();
    page.on("pageerror", error => errors.push(error.message));
    for (const [path, title] of [
      [PHOTO, "Frame it Wright Photography"],
      [`${PHOTO}/about`, "Hi! I'm Aaron."],
      [`${PHOTO}/portfolio`, "portfolio"],
      [`${PHOTO}/portfolio/couples-engagement`, "couples & engagement"],
      [`${PHOTO}/portfolio/portraits`, "portraits"],
      [`${PHOTO}/galleries`, "galleries"],
      [`${PHOTO}/contact`, "Create with me!"],
      ["/creative/mailing-list", "mailing list"],
      ["/creative", "about"],
      ["/creative/inspirations", "inspirations"],
      ["/creative/projects", "projects"],
      ["/about/platforms", "software & platforms"],
      ["/cognitive-science/projects/tidy-tuesday", "tidy tuesday"],
    ]) {
      const response = await page.goto(base + path, { waitUntil: "networkidle" });
      assert.equal(response.status(), 200, path);
      assert.equal(await page.locator("h1").innerText(), title);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `Overflow at ${width}: ${path}`);
      if (path.startsWith(PHOTO)) {
        // Published photographs: described for screen readers, never labelled with camera file names; no arrows.
        if (catalog.length) assert(await page.locator("main img").evaluateAll(images => images.every(image => image.alt === "" ? image.closest("[aria-hidden=true]") : image.alt.trim().length > 10)));
        assert(!/IMG_\d/.test(await page.locator("main").innerText()));
        assert(!(await page.locator("body").innerText()).includes("→"), `No arrows: ${path}`);
        assert.equal(await page.getByRole("link", { name: "Create with me!" }).count(), path.endsWith("/contact") ? 0 : 1, path);
        await page.screenshot({ path: `${artifacts}/photography${path.slice(PHOTO.length).replaceAll("/", "-") || "-home"}-${width}.png`, fullPage: true });
      }
      if (path === "/creative") {
        const article = await page.locator("main article").innerText();
        assert(article.includes("Hi! :)"));
        assert(article.includes("coffee occifiando"));
        assert(article.includes("stick aroudn"));
        assert(!article.includes("While you wait"));
        assert(!article.includes("tbd"));
        assert.equal(await page.locator('main article a[href="/creative/inspirations"]').count(), 1);
      }
      if (path === "/creative/projects") {
        assert.equal(await page.locator('main article a[href="/frame-it-wright-photography"]').count(), 0);
      }
      if (path.endsWith("/galleries")) {
        const portal = page.getByRole("link", { name: "Open your gallery on Pic-Time" });
        assert.equal(await portal.getAttribute("href"), "https://frameitwrightphotography.pic-time.com/client");
        assert.equal(await page.locator('input[type="password"]').count(), 0);
      }
      if (path === "/creative" || path === "/creative/inspirations") {
        await page.screenshot({ path: `${artifacts}/${path === "/creative" ? "creative" : "inspirations"}-${width}.png`, fullPage: true });
      }
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), canonicalFor(path));
    }
    await page.goto(base + "/frame-it-wright-photography/portfolio", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Switch to night mode" }).click();
    assert(await page.locator("html").evaluate(element => element.classList.contains("dark")));
    await page.screenshot({ path: `${artifacts}/portfolio-dark-${width}.png`, fullPage: true });
    await page.getByRole("button", { name: "Switch to light mode" }).click();

    await page.goto(base + `${PHOTO}/mailing-list`, { waitUntil: "networkidle" });
    assert.equal(new URL(page.url()).pathname, `${PHOTO}/contact`);
    const inquiry = page.getByRole("form", { name: "Prepare a photography inquiry" });
    const draft = inquiry.getByRole("link", { name: "open email draft" });
    const prepare = inquiry.getByRole("button", { name: "prepare an inquiry" });
    const shoots = ["wedding", "couples & engagement", "family, friends, & lifestyle", "graduation & seniors", "portraits", "events", "something else"];
    assert.deepEqual(await inquiry.locator('input[name="shootType"]').evaluateAll(inputs => inputs.map(input => input.value)), shoots);
    let inquiryRequests = 0;
    const trackInquiry = request => { if (request.method() !== "GET") inquiryRequests++; };
    page.on("request", trackInquiry);
    await prepare.click();
    assert.equal(await draft.count(), 0, "Empty inquiry cannot prepare a draft");
    await inquiry.getByLabel("First name *", { exact: true }).fill("Test");
    await inquiry.getByLabel("Last name *", { exact: true }).fill("Reader");
    await inquiry.getByLabel("Email *", { exact: true }).fill("not-an-email");
    await inquiry.getByRole("radio", { name: "couples & engagement", exact: true }).check({ force: true });
    await inquiry.getByRole("combobox", { name: "Location *", exact: true }).selectOption("unsure");
    assert.equal(await inquiry.getByLabel("Location or area *", { exact: true }).count(), 0);
    await inquiry.getByLabel("Scenery or vibe (optional)", { exact: true }).fill("A quiet trail at sunset");
    await inquiry.getByLabel("A little about your idea *", { exact: true }).fill("A relaxed celebration with friends.");
    await prepare.click();
    assert.equal(await draft.count(), 0, "Invalid email cannot prepare a draft");
    await inquiry.getByLabel("Email *", { exact: true }).fill("offline@example.com");
    await inquiry.getByLabel("A little about your idea *", { exact: true }).fill("   ");
    await prepare.click();
    assert.equal(await draft.count(), 0, "Whitespace-only idea is invalid");
    await inquiry.getByLabel("A little about your idea *", { exact: true }).fill("A relaxed celebration with friends.");
    await inquiry.getByLabel("Tell me about yourself! (optional)", { exact: true }).fill("We love hiking and music.");
    await inquiry.getByLabel("Preferred date range or season (optional)", { exact: true }).fill("A weekend in October");
    await inquiry.getByLabel("How far could you travel? (optional)", { exact: true }).fill("Within an hour");
    await inquiry.getByLabel("I'd like to arrange a call about ideas and plans (optional)", { exact: true }).check();
    await prepare.click();
    let href = await draft.getAttribute("href");
    assert(href.startsWith("mailto:frameitwright@gmail.com?"));
    let body = new URL(href).searchParams.get("body");
    for (const expected of ["First name: Test", "Last name: Reader", "Email: offline@example.com", "Shoot type: couples & engagement", "A quiet trail at sunset", "A little about me:", "We love hiking and music.", "A little about my idea:", "A relaxed celebration with friends.", "Within an hour", "Please email me to find a time."]) assert(body.includes(expected), expected);
    assert.equal(await inquiry.locator('input[name="phone"]').getAttribute("required"), null);
    await inquiry.getByRole("combobox", { name: "Location *", exact: true }).selectOption("known");
    assert.equal(await draft.count(), 0, "Changing the inquiry invalidates its draft");
    assert.equal(await inquiry.getByLabel("Scenery or vibe (optional)", { exact: true }).count(), 0);
    await prepare.click();
    assert.equal(await draft.count(), 0, "Known location needs a location value");
    await inquiry.getByLabel("Location or area *", { exact: true }).fill("Boston waterfront");
    await prepare.click();
    href = await draft.getAttribute("href");
    body = new URL(href).searchParams.get("body");
    assert(body.includes("Location: Boston waterfront"));
    assert(!body.includes("A quiet trail at sunset"), "Hidden venue preferences are excluded");
    assert.equal(inquiryRequests, 0, "Preparing an inquiry must never send contact details");
    page.off("request", trackInquiry);
    assert(!page.url().includes("offline@example.com"));

    for (const [oldPath, newPath] of [["/personal", "/creative"], ["/personal/inspirations", "/creative/inspirations"], ["/personal#art", "/creative/inspirations#art"], ["/personal/inspirations#communities", "/creative/inspirations#communities"]]) {
      await page.goto(base + oldPath, { waitUntil: "networkidle" });
      await page.waitForURL(base + newPath);
    }
    await page.goto(base + "/contact", { waitUntil: "networkidle" });
    assert.equal(await page.locator(".contact-placard").count(), 3);
    assert.equal(await page.locator('#photography-contact').innerText(), "photography");
    assert((await page.locator('section[aria-labelledby="photography-contact"]').innerText()).includes("Frame It Wright Photography"));
    assert.equal(await page.locator('section[aria-labelledby="photography-contact"] a[href*="buymeacoffee"]').count(), 0);
    assert.equal(await page.locator('section[aria-labelledby="creative-contact"] a[href*="buymeacoffee"]').count(), 1);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `Contact overflow at ${width}`);
    await page.screenshot({ path: `${artifacts}/contact-${width}.png`, fullPage: true });

    await page.goto(base + "/creative/mailing-list", { waitUntil: "networkidle" });
    const subscribe = page.getByRole("form", { name: "Join the mailing list" });
    let stored = false;
    await page.route("**/api/creative/mailing-list/subscribe", async route => {
      assert.equal(route.request().method(), "POST");
      await route.fulfill({ status: stored ? 200 : 503, contentType: "application/json", body: JSON.stringify({ message: stored ? "You’re on the creative list—thank you!" : "Sign-up is being configured. Please check back soon." }) });
    });
    await subscribe.getByLabel("email", { exact: true }).fill("offline@example.com");
    await subscribe.getByRole("button", { name: "join the creative list" }).click();
    await subscribe.getByRole("alert").waitFor();
    assert.equal(await subscribe.getByRole("status").count(), 0);
    stored = true;
    await subscribe.getByRole("button", { name: "join the creative list" }).click();
    await subscribe.getByRole("status").waitFor();
    assert((await subscribe.getByRole("status").innerText()).includes("You’re on the creative list"));

    await page.goto(base + "/scope-for-imagination/mailing-list", { waitUntil: "networkidle" });
    const journalSubscribe = page.getByRole("form", { name: "Join the mailing list" });
    await page.route("**/api/newsletter/subscribe", async route => {
      assert.equal(route.request().method(), "POST");
      assert.equal(JSON.parse(route.request().postData()).email, "offline@example.com");
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ message: "You’re on the list—thank you!" }) });
    });
    await journalSubscribe.getByLabel("email", { exact: true }).fill("offline@example.com");
    await journalSubscribe.getByRole("button", { name: "join the list" }).click();
    await journalSubscribe.getByRole("status").waitFor();
    assert.equal(await page.getByRole("form", { name: "Unsubscribe from updates" }).count(), 1);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `SFI mailing list overflow at ${width}`);
    await page.screenshot({ path: `${artifacts}/sfi-mailing-list-${width}.png`, fullPage: true });

    // Contour-map background: present on main-site pages, not in photography, and never wider than the page.
    await page.goto(base + "/creative", { waitUntil: "networkidle" });
    await page.waitForFunction(() => document.documentElement.dataset.topo === "on");
    assert.equal(await page.locator("[data-topo-background]").count(), 1);
    assert.equal(await page.locator("[data-topo-background]").getAttribute("aria-hidden"), "true");
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `Background overflow at ${width}`);
    await page.goto(base + `${PHOTO}/portfolio`, { waitUntil: "networkidle" });
    assert.equal(await page.locator("[data-topo-background]").count(), 0, "Photography has its own ground, without contours");
    await context.close();
  }
  const noScript = await browser.newContext({ javaScriptEnabled: false });
  await noScript.route("**/*", route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
  const noScriptPage = await noScript.newPage();
  await noScriptPage.goto(base + `${PHOTO}/contact`);
  assert(await noScriptPage.getByRole("button", { name: "prepare an inquiry" }).isDisabled(), "No-JS form cannot submit personal data to the URL");
  await noScript.close();
  assert.deepEqual(errors, []);
  console.log("Creative pages: desktop/mobile, light/dark, placeholder boundaries, canonical URLs, Creative redirects, contact separation, conditional booking validation/privacy, no-JS safety, mocked subscription states, and the contour background passed.");
  console.log(`Screenshots: ${artifacts}`);
} finally {
  await browser.close();
}
