import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { packageTag, tagNpmPackage } from "./tag-npm-package.mjs";

const REPOSITORY = "swc-project/swc";
const TOKEN = "test-token";
const TARGET_COMMIT = "1111111111111111111111111111111111111111";
const OTHER_COMMIT = "2222222222222222222222222222222222222222";
const TAG_OBJECT = "3333333333333333333333333333333333333333";

test("derives scoped release tags from package metadata", () => {
  assert.equal(
    packageTag({ name: "@swc/helpers", version: "0.5.23" }),
    "@swc/helpers@v0.5.23"
  );
  assert.equal(
    packageTag({ name: "@swc/types", version: "0.1.28" }),
    "@swc/types@v0.1.28"
  );
});

test("rejects incomplete package metadata", () => {
  assert.throws(
    () => packageTag({ version: "0.5.23" }),
    /non-empty string name/
  );
  assert.throws(
    () => packageTag({ name: "@swc/helpers" }),
    /non-empty string version/
  );
});

test("creates a missing package-derived tag at the target commit", async () => {
  await withPackage(async (packageDirectory) => {
    const fetchMock = mockFetch([
      jsonResponse(404, { message: "Not Found" }),
      jsonResponse(201, {
        ref: "refs/tags/@swc/helpers@v0.5.23",
      }),
    ]);

    const result = await run(packageDirectory, fetchMock);

    assert.deepEqual(result, {
      tag: "@swc/helpers@v0.5.23",
      created: true,
    });
    assert.equal(fetchMock.calls.length, 2);
    assert.match(fetchMock.calls[0].url, /tags\/%40swc%2Fhelpers%40v0\.5\.23$/);
    assert.equal(fetchMock.calls[0].url.includes(TOKEN), false);
    assert.equal(
      fetchMock.calls[0].init.headers.Authorization,
      `Bearer ${TOKEN}`
    );
    assert.deepEqual(JSON.parse(fetchMock.calls[1].init.body), {
      ref: "refs/tags/@swc/helpers@v0.5.23",
      sha: TARGET_COMMIT,
    });
  });
});

test("accepts an existing tag at the target commit", async () => {
  await withPackage(async (packageDirectory) => {
    const fetchMock = mockFetch([commitRef(TARGET_COMMIT)]);

    const result = await run(packageDirectory, fetchMock);

    assert.equal(result.created, false);
    assert.equal(fetchMock.calls.length, 1);
  });
});

test("rejects an existing tag at another commit", async () => {
  await withPackage(async (packageDirectory) => {
    const fetchMock = mockFetch([commitRef(OTHER_COMMIT)]);

    await assert.rejects(
      run(packageDirectory, fetchMock),
      new RegExp(`expected ${TARGET_COMMIT}, but it points to ${OTHER_COMMIT}`)
    );
    assert.equal(fetchMock.calls.length, 1);
  });
});

test("accepts a same-commit create race", async () => {
  await withPackage(async (packageDirectory) => {
    const fetchMock = mockFetch([
      jsonResponse(404, { message: "Not Found" }),
      jsonResponse(422, { message: "Reference already exists" }),
      commitRef(TARGET_COMMIT),
    ]);

    const result = await run(packageDirectory, fetchMock);

    assert.equal(result.created, false);
    assert.equal(fetchMock.calls.length, 3);
  });
});

test("rejects a conflicting create race", async () => {
  await withPackage(async (packageDirectory) => {
    const fetchMock = mockFetch([
      jsonResponse(404, { message: "Not Found" }),
      jsonResponse(422, { message: "Reference already exists" }),
      commitRef(OTHER_COMMIT),
    ]);

    await assert.rejects(
      run(packageDirectory, fetchMock),
      new RegExp(`expected ${TARGET_COMMIT}, but it points to ${OTHER_COMMIT}`)
    );
  });
});

test("resolves an existing annotated tag to its commit", async () => {
  await withPackage(async (packageDirectory) => {
    const fetchMock = mockFetch([
      jsonResponse(200, { object: { type: "tag", sha: TAG_OBJECT } }),
      jsonResponse(200, {
        object: { type: "commit", sha: TARGET_COMMIT },
      }),
    ]);

    const result = await run(packageDirectory, fetchMock);

    assert.equal(result.created, false);
    assert.match(
      fetchMock.calls[1].url,
      new RegExp(`/git/tags/${TAG_OBJECT}$`)
    );
  });
});

test("reports GitHub API creation failures", async () => {
  await withPackage(async (packageDirectory) => {
    const fetchMock = mockFetch([
      jsonResponse(404, { message: "Not Found" }),
      jsonResponse(403, { message: "Resource not accessible" }),
    ]);

    await assert.rejects(
      run(packageDirectory, fetchMock),
      /Failed to create tag @swc\/helpers@v0\.5\.23 \(HTTP 403\): Resource not accessible/
    );
  });
});

function run(packageDirectory, fetchImpl) {
  return tagNpmPackage({
    packageDirectory,
    targetCommit: TARGET_COMMIT,
    repository: REPOSITORY,
    token: TOKEN,
    fetchImpl,
  });
}

async function withPackage(callback) {
  const directory = await mkdtemp(path.join(tmpdir(), "swc-tag-package-"));
  try {
    await writeFile(
      path.join(directory, "package.json"),
      JSON.stringify({ name: "@swc/helpers", version: "0.5.23" })
    );
    await callback(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

function commitRef(sha) {
  return jsonResponse(200, { object: { type: "commit", sha } });
}

function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function mockFetch(responses) {
  const calls = [];
  const fetchMock = async (url, init) => {
    calls.push({ url, init });
    const response = responses.shift();
    assert.ok(response, `Unexpected request to ${url}`);
    return response;
  };
  fetchMock.calls = calls;
  return fetchMock;
}
