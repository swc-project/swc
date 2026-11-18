import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const cases = [
  {
    name: "unlisted bot",
    author: { login: "unlisted-app[bot]", type: "Bot" },
    allowed: true,
  },
  {
    name: "repository writer",
    author: { login: "writer", type: "User" },
    permission: "write",
    allowed: true,
  },
  {
    name: "unlisted reader",
    author: { login: "reader", type: "User" },
    permission: "read",
    allowed: false,
  },
  {
    name: "permission API failure",
    author: { login: "reader", type: "User" },
    status: 429,
    permission: "read",
    error: true,
  },
];

for (const scenario of cases) {
  test(`action entrypoint: ${scenario.name}`, async (t) => {
    const directory = await mkdtemp(join(tmpdir(), "swc-contributor-policy-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const eventPath = join(directory, "event.json");
    const outputPath = join(directory, "output");
    await writeFile(
      eventPath,
      JSON.stringify({ pull_request: { number: 123 } })
    );
    await writeFile(outputPath, "");

    const requests = [];
    const server = createServer((request, response) => {
      requests.push({
        method: request.method,
        url: request.url,
        token: request.headers.authorization,
      });
      if (request.url === "/repos/swc-project/swc/pulls/123") {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ state: "open", user: scenario.author }));
      } else {
        response.writeHead(scenario.status ?? 200, {
          "Content-Type": "application/json",
        });
        response.end(JSON.stringify({ permission: scenario.permission }));
      }
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    t.after(() => new Promise((resolve) => server.close(resolve)));

    const child = spawn(
      process.execPath,
      [fileURLToPath(new URL("main.mjs", import.meta.url))],
      {
        timeout: 10_000,
        env: {
          GITHUB_EVENT_NAME: "pull_request",
          GITHUB_EVENT_PATH: eventPath,
          GITHUB_REPOSITORY: "swc-project/swc",
          GITHUB_API_URL: `http://127.0.0.1:${server.address().port}`,
          GITHUB_OUTPUT: outputPath,
          POLICY_TOKEN: "test-token",
          POLICY_CLOSE_UNTRUSTED: "false",
        },
      }
    );
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (data) => {
      stdout += data;
    });
    child.stderr.on("data", (data) => {
      stderr += data;
    });
    const code = await new Promise((resolve, reject) => {
      child.once("error", reject);
      child.once("close", resolve);
    });

    assert(
      requests.every(
        (request) =>
          request.method === "GET" && request.token === "Bearer test-token"
      )
    );
    assert.equal(requests.length, scenario.author.type === "Bot" ? 1 : 2);
    assert(!stdout.includes("test-token") && !stderr.includes("test-token"));
    if (scenario.error) {
      assert.equal(code, 1);
      assert.equal(await readFile(outputPath, "utf8"), "");
      assert(JSON.parse(stderr).error.includes("HTTP 429"));
    } else {
      assert.equal(code, 0, stderr);
      assert.equal(
        await readFile(outputPath, "utf8"),
        `allowed=${scenario.allowed}\n`
      );
      assert.equal(JSON.parse(stdout).allowed, scenario.allowed);
    }
  });
}
