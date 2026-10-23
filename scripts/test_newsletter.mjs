// Offline route tests: all Resend requests are intercepted before any network call.
// Run: node --test scripts/test_newsletter.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, test } from "node:test";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const loaded = new Map();
// Use the project's TypeScript compiler without emitting build files. Resolve
// the same @/ imports as Next so these tests exercise the actual route handlers.
function loadTypeScript(filename) {
  const absolute = path.resolve(root, filename);
  if (loaded.has(absolute)) return loaded.get(absolute).exports;
  const compiledModule = { exports: {} };
  loaded.set(absolute, compiledModule);
  const code = ts.transpileModule(readFileSync(absolute, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: absolute,
  }).outputText;
  const localRequire = (specifier) => specifier.startsWith("@/")
    ? loadTypeScript(`src/${specifier.slice(2)}.ts`)
    : require(specifier);
  new Function("require", "module", "exports", code)(localRequire, compiledModule, compiledModule.exports);
  return compiledModule.exports;
}

const creative = loadTypeScript("src/app/api/creative/mailing-list/subscribe/route.ts").POST;
const sfi = loadTypeScript("src/app/api/newsletter/subscribe/route.ts").POST;
const unsubscribe = loadTypeScript("src/app/api/newsletter/unsubscribe/route.ts").POST;
const retiredPhotography = loadTypeScript("src/app/api/photography/mailing-list/subscribe/route.ts").POST;
const originalFetch = globalThis.fetch;
const originalError = console.error;
const envNames = ["RESEND_API_KEY", "RESEND_CREATIVE_SEGMENT_ID", "RESEND_SFI_SEGMENT_ID"];
const originalEnv = Object.fromEntries(envNames.map((name) => [name, process.env[name]]));
let requests;
let logs;
let responses;

beforeEach(() => {
  requests = [];
  logs = [];
  responses = [];
  process.env.RESEND_API_KEY = "offline-test-key";
  process.env.RESEND_CREATIVE_SEGMENT_ID = "offline-creative-segment";
  process.env.RESEND_SFI_SEGMENT_ID = "offline-sfi-segment";
  console.error = (...args) => logs.push(args);
  globalThis.fetch = async (url, options) => {
    requests.push({ url, options });
    assert.match(url, /^https:\/\/api\.resend\.com\/contacts/);
    assert(responses.length, "Unexpected upstream request; no real requests are allowed");
    const next = responses.shift();
    if (next instanceof Error) throw next;
    return next;
  };
});
afterEach(() => {
  globalThis.fetch = originalFetch;
  console.error = originalError;
  for (const name of envNames) {
    if (originalEnv[name] === undefined) delete process.env[name];
    else process.env[name] = originalEnv[name];
  }
});

function request(body, raw = false) {
  return new Request("http://localhost/api/creative/mailing-list/subscribe", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: raw ? body : JSON.stringify(body),
  });
}
const contact = { email: "Reader@example.com", interest: "writing", firstName: " Reader " };
const upstream = (status, message = "") => new Response(JSON.stringify({ message }), { status });

await test("reject malformed, oversized, invalid and honeypot requests without subscribing", async () => {
  for (const body of [null, [], 1, "string", {}, { email: "bad" },
    { ...contact, email: `${"a".repeat(250)}@example.com` },
    { ...contact, interest: "not-an-option" }, { ...contact, firstName: "a".repeat(81) },
    { ...contact, company: "bot" }, { ...contact, notes: "a".repeat(4096) }]) {
    assert.equal((await creative(request(body))).status, 400);
  }
  assert.equal((await creative(request("{", true))).status, 400);
  assert.equal(requests.length, 0);
});

await test("missing Creative setup never falls back to the SFI list or claims success", async () => {
  delete process.env.RESEND_CREATIVE_SEGMENT_ID;
  const response = await creative(request(contact));
  assert.equal(response.status, 503);
  assert.match((await response.json()).message, /being configured/);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.equal(requests.length, 0);
});

await test("Creative signup writes normalized contact to its dedicated segment before success", async () => {
  responses.push(upstream(201));
  const response = await creative(request({ ...contact, notes: "must not be sent", location: "must not be sent" }));
  assert.equal(response.status, 200);
  assert.match((await response.json()).message, /creative list/);
  const body = JSON.parse(requests[0].options.body);
  assert.equal(body.email, "reader@example.com");
  assert.equal(body.first_name, "Reader");
  assert.deepEqual(body.segments, [{ id: "offline-creative-segment" }]);
  assert.deepEqual(body.properties, { creative_interest: "writing", source: "creative" });
  assert.equal(requests.length, 1);
});

await test("subscription success waits for storage to finish", async () => {
  let finish;
  let started;
  const pending = new Promise((resolve) => { finish = resolve; });
  const began = new Promise((resolve) => { started = resolve; });
  globalThis.fetch = () => { started(); return pending; };
  let completed = false;
  const result = creative(request(contact)).then((response) => { completed = true; return response; });
  await began;
  assert.equal(completed, false);
  finish(upstream(201));
  assert.equal((await result).status, 200);
});

await test("existing contacts must update and join the segment before success", async () => {
  responses.push(upstream(409), upstream(200), upstream(200));
  assert.equal((await creative(request(contact))).status, 200);
  assert.deepEqual(requests.map(({ options }) => options.method), ["POST", "PATCH", "POST"]);
  assert.match(requests[2].url, /\/segments\/offline-creative-segment$/);
});

await test("partial contact or segment failures cannot return subscription success", async () => {
  responses.push(upstream(409), upstream(500, "private-address@example.com"));
  assert.equal((await creative(request(contact))).status, 502);
  assert.equal(requests.length, 2);
  requests.length = 0;
  responses.push(upstream(409), upstream(200), upstream(500));
  assert.equal((await creative(request(contact))).status, 502);
  assert.equal(requests.length, 3);
  responses.push(upstream(409), upstream(200), upstream(409));
  assert.equal((await creative(request(contact))).status, 502, "A segment conflict is not a confirmed save");
});

await test("upstream and network errors never expose private contact data", async () => {
  responses.push(upstream(500, "private-address@example.com secret-token"));
  const response = await creative(request(contact));
  assert.equal(response.status, 502);
  assert.doesNotMatch(await response.text(), /private-address|secret-token/);
  responses.push(new Error("private-address@example.com secret-token"));
  assert.equal((await creative(request(contact))).status, 502);
  assert.doesNotMatch(JSON.stringify(logs), /private-address|secret-token/);
});

await test("SFI keeps its original audience and preference property", async () => {
  responses.push(upstream(201));
  assert.equal((await sfi(request({ email: "reader@example.com", interest: "faith" }))).status, 200);
  const body = JSON.parse(requests[0].options.body);
  assert.deepEqual(body.segments, [{ id: "offline-sfi-segment" }]);
  assert.deepEqual(body.properties, { interest: "faith", source: "scope_for_imagination" });
});

await test("unsubscribe validates payloads and hides whether an address exists", async () => {
  assert.equal((await unsubscribe(request(null))).status, 400);
  assert.equal((await unsubscribe(request({ email: "bad" }))).status, 400);
  responses.push(upstream(404));
  const absent = await unsubscribe(request({ email: "reader@example.com" }));
  responses.push(upstream(200));
  const present = await unsubscribe(request({ email: "reader@example.com" }));
  assert.equal(absent.status, 200);
  assert.deepEqual(await absent.json(), await present.json());
  assert.deepEqual(JSON.parse(requests[0].options.body), { unsubscribed: true });
});

await test("retired photography intake cannot add a booking request to an audience", async () => {
  const response = await retiredPhotography(request(contact));
  assert.equal(response.status, 410);
  assert.match((await response.json()).message, /booking/);
  assert.equal(requests.length, 0);
});
