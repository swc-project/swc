import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { GitHubClient } from "./github.mjs";
import { NOTICE_MARKER, runPolicy } from "./run.mjs";

const source = await readFile(
  new URL("fixtures/contributors.yml", import.meta.url),
  "utf8"
);
const event = {
  pull_request: { number: 123, user: { login: "trustedperson", type: "User" } },
  sender: { login: "maintainer" },
};
const user = { login: "outside-user", type: "User" };
const open = { number: 123, state: "open", user };
const closed = { ...open, state: "closed" };

function fixture(responses) {
  const calls = [];
  const client = new GitHubClient({
    repository: "swc-project/swc",
    token: "test-token",
    fetchImpl: async (url, init) => {
      calls.push({ url, ...init });
      assert(responses.length, `Unexpected request: ${init.method} ${url}`);
      const { status = 200, body } = responses.shift();
      return new Response(JSON.stringify(body), { status });
    },
  });
  return { client, calls, responses };
}

function run(client, overrides = {}) {
  return runPolicy({
    eventName: "pull_request_target",
    event,
    source,
    client,
    closeUntrusted: true,
    ...overrides,
  });
}

test("closes a denied live author, not the event sender or stale payload author", async () => {
  const { client, calls, responses } = fixture([
    { body: open },
    { body: { permission: "read" } },
    { body: [] },
    { body: open },
    { body: { id: 1 } },
    { body: open },
    { body: closed },
  ]);
  const result = await run(client);
  assert.deepEqual(result, {
    allowed: false,
    reason: "unlisted",
    number: 123,
    author: "outside-user",
  });
  assert.equal(responses.length, 0);
  const comment = calls.find((call) => call.method === "POST");
  const commentBody = JSON.parse(comment.body).body;
  assert(commentBody.startsWith(NOTICE_MARKER));
  assert.equal(
    commentBody.split("\n\n").at(-1),
    "Please [open an issue](https://github.com/swc-project/swc/issues/new/choose) describing the bug or proposed improvement instead of submitting a pull request."
  );
  assert.doesNotMatch(
    commentBody,
    /contact an SWC maintainer|request inclusion|can be reopened|\.github\/contributors\.yml/
  );
  const close = calls.at(-1);
  assert.equal(close.method, "PATCH");
  assert.deepEqual(JSON.parse(close.body), { state: "closed" });
  assert(
    calls.every(
      (call) =>
        call.headers.Authorization === "Bearer test-token" &&
        !call.url.includes("test-token")
    )
  );
});

for (const action of ["opened", "reopened", "synchronize"]) {
  test(`does not duplicate the notice on ${action}`, async () => {
    const { client, calls } = fixture([
      { body: open },
      { body: { permission: "read" } },
      {
        body: [
          {
            user: { login: "github-actions[bot]", type: "Bot" },
            body: NOTICE_MARKER,
          },
        ],
      },
      { body: open },
      { body: open },
      { body: closed },
    ]);
    await run(client, { event: { ...event, action } });
    assert.equal(calls.filter((call) => call.method === "POST").length, 0);
    assert.equal(calls.filter((call) => call.method === "PATCH").length, 1);
  });
}

test("bots are allowed without a list entry or permission lookup", async () => {
  const { client, calls } = fixture([
    { body: { ...open, user: { login: "any-app[bot]", type: "Bot" } } },
  ]);
  assert.equal((await run(client)).allowed, true);
  assert.equal(calls.length, 1);
});

test("write access is sufficient without a list entry", async () => {
  const { client, calls } = fixture([
    { body: open },
    { body: { permission: "write", role_name: "custom-writer" } },
  ]);
  assert.equal((await run(client)).allowed, true);
  assert.equal(calls.length, 2);
});

test("a listed triager can contribute without write access", async () => {
  const { client, calls } = fixture([
    { body: { ...open, user: { login: "NextEngineer", type: "User" } } },
  ]);
  assert.equal((await run(client)).allowed, true);
  assert.equal(calls.length, 1);
});

test("a read-only CI check never comments or closes", async () => {
  const { client, calls } = fixture([
    { body: open },
    { body: { permission: "none" } },
  ]);
  assert.equal(
    (await run(client, { eventName: "pull_request", closeUntrusted: false }))
      .allowed,
    false
  );
  assert(calls.every((call) => call.method === "GET"));
});

test("refuses writes from pull_request", async () => {
  const { client, calls } = fixture([]);
  await assert.rejects(
    run(client, { eventName: "pull_request" }),
    /Only pull_request_target/
  );
  assert.equal(calls.length, 0);
});

for (const eventName of ["push", "merge_group", "workflow_dispatch"]) {
  test(`does not gate ${eventName}`, async () => {
    const { client, calls } = fixture([]);
    assert.deepEqual(await run(client, { eventName, event: {} }), {
      allowed: true,
      reason: "non-pull-request",
    });
    assert.equal(calls.length, 0);
  });
}

test("does not change an already closed or merged PR", async () => {
  const { client, calls } = fixture([{ body: { ...closed, merged: true } }]);
  await run(client);
  assert.equal(calls.length, 1);
});

test("rechecks state before posting a notice", async () => {
  const { client, calls } = fixture([
    { body: open },
    { body: { permission: "read" } },
    { body: [] },
    { body: closed },
  ]);
  await run(client);
  assert(calls.every((call) => call.method === "GET"));
});

test("rechecks state before closing, even after posting the notice", async () => {
  const { client, calls } = fixture([
    { body: open },
    { body: { permission: "read" } },
    { body: [] },
    { body: open },
    { body: { id: 1 } },
    { body: closed },
  ]);
  await run(client);
  assert.equal(calls.filter((call) => call.method === "PATCH").length, 0);
});

test("invalid YAML does not make API requests or close PRs", async () => {
  const { client, calls } = fixture([]);
  const invalid = await readFile(
    new URL("fixtures/invalid-contributors.yml", import.meta.url),
    "utf8"
  );
  await assert.rejects(
    run(client, { source: invalid }),
    /Invalid contributor YAML/
  );
  assert.equal(calls.length, 0);
});

for (const status of [403, 404, 429, 500]) {
  test(`permission API HTTP ${status} does not become a denial`, async () => {
    const { client, calls } = fixture([
      { body: open },
      { status, body: { message: "API failure" } },
    ]);
    await assert.rejects(run(client), new RegExp(`HTTP ${status}`));
    assert(calls.every((call) => call.method === "GET"));
  });
}

test("comment listing failures prevent automatic closure", async () => {
  const { client, calls } = fixture([
    { body: open },
    { body: { permission: "read" } },
    { status: 500, body: {} },
  ]);
  await assert.rejects(run(client), /HTTP 500/);
  assert(calls.every((call) => call.method === "GET"));
});

test("notices are paginated and user-written marker text is not trusted", async () => {
  const fake = {
    user: { login: "outside-user", type: "User" },
    body: NOTICE_MARKER,
  };
  const { client, calls } = fixture([
    { body: Array.from({ length: 100 }, () => fake) },
    {
      body: [
        {
          user: { login: "github-actions[bot]", type: "Bot" },
          body: NOTICE_MARKER,
        },
      ],
    },
  ]);
  assert.equal(await client.hasNotice(123, NOTICE_MARKER), true);
  assert(calls[1].url.endsWith("page=2"));
});

test("rejects missing PR numbers before requesting GitHub", async () => {
  const { client, calls } = fixture([]);
  await assert.rejects(run(client, { event: {} }), /pull request number/);
  assert.equal(calls.length, 0);
});
