import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { checkContributor, parseContributors } from "./policy.mjs";

const source = await readFile(
  new URL("fixtures/contributors.yml", import.meta.url),
  "utf8"
);
const cases = JSON.parse(
  await readFile(new URL("fixtures/decisions.json", import.meta.url), "utf8")
);

for (const { login, type, permission, ...expected } of cases) {
  test(`contributor fixture: ${login}`, async () => {
    let calls = 0;
    const result = await checkContributor({
      author: { login, type },
      contributors: parseContributors(source),
      getPermission: async (actual) => {
        assert.equal(actual, login);
        calls++;
        return permission;
      },
    });
    assert.deepEqual(result, expected);
    assert.equal(calls, permission === undefined ? 0 : 1);
  });
}

test("validates the repository allowlist", async () => {
  const actual = await readFile(
    new URL("../../contributors.yml", import.meta.url),
    "utf8"
  );
  parseContributors(actual);
});

test("individual contributors have the same access as product groups", async () => {
  assert.deepEqual(
    await checkContributor({
      author: { login: "independentengineer", type: "User" },
      contributors: parseContributors(source),
      getPermission: async () => {
        throw new Error("Listed users do not require a permission lookup");
      },
    }),
    { allowed: true, reason: "allowlist", group: "individuals" }
  );
});

test("rejects duplicate YAML group keys", async () => {
  const invalid = await readFile(
    new URL("fixtures/invalid-contributors.yml", import.meta.url),
    "utf8"
  );
  assert.throws(() => parseContributors(invalid), /Invalid contributor YAML/);
});

test("rejects malformed groups rather than silently dropping entries", () => {
  for (const invalid of [
    "",
    "[]",
    "groups: []",
    "groups: null",
    "groups:\n  nextjs: someone",
    "groups:\n  individuals: [123]",
    "groups:\n  individuals: ['@someone']",
    "groups:\n  individuals: ['some one']",
    "groups: {}\nunknown: true",
    "groups: {nextjs: [",
  ]) {
    assert.throws(() => parseContributors(invalid));
  }
  assert.equal(parseContributors("groups: {}\n").size, 0);
});

test("does not turn permission failures into denials", async () => {
  await assert.rejects(
    checkContributor({
      author: { login: "outside-user", type: "User" },
      contributors: new Map(),
      getPermission: async () => {
        throw new Error("API unavailable");
      },
    }),
    /API unavailable/
  );
  await assert.rejects(
    checkContributor({
      author: { login: "outside-user", type: "User" },
      contributors: new Map(),
      getPermission: async () => "unexpected",
    }),
    /unsupported repository permission/
  );
});

test("rejects missing authors", async () => {
  for (const author of [undefined, {}, { login: "someone" }]) {
    await assert.rejects(
      checkContributor({ author, contributors: new Map() }),
      /supported author account/
    );
  }
});
