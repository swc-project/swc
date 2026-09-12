import assert from "node:assert/strict";
import test from "node:test";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(execFile);
const script = new URL("./resolve-npm-tag.mjs", import.meta.url);

async function resolve(version) {
    const { stdout } = await exec(process.execPath, [script.pathname, version]);
    return stdout.trim();
}

test("maps maintained npm release lines", async () => {
    assert.equal(await resolve("1.16.0"), "latest");
    assert.equal(await resolve("2.0.0-next.4"), "next");
    assert.equal(await resolve("2.0.0-nightly-20260711.1"), "nightly");
});
