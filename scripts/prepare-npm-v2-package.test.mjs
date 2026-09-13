import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

const exec = promisify(execFile);
const script = new URL("./prepare-npm-v2-package.mjs", import.meta.url);

test("rewrites the private source identity in the native loader", async () => {
    const temporary = await mkdtemp(path.join(os.tmpdir(), "swc-v2-package-"));
    try {
        await writeFile(
            path.join(temporary, "package.json"),
            JSON.stringify({
                name: "@swc-internal/core-v2",
                version: "2.0.0-next.0",
                private: true,
                dependencies: { "@swc-internal/types-v2": "workspace:^" },
            })
        );
        await writeFile(
            path.join(temporary, "binding.js"),
            "require('@swc-internal/core-v2-darwin-arm64'); const expected = '2.0.0-next.0';"
        );

        await exec(process.execPath, [
            script.pathname,
            temporary,
            "2.0.0-next.8",
            "@swc/core",
        ]);

        const manifest = JSON.parse(
            await readFile(path.join(temporary, "package.json"), "utf8")
        );
        const loader = await readFile(
            path.join(temporary, "binding.js"),
            "utf8"
        );
        assert.equal(manifest.name, "@swc/core");
        assert.equal(manifest.private, undefined);
        assert.match(loader, /@swc\/core-darwin-arm64/);
        assert.match(loader, /2\.0\.0-next\.8/);
        assert.doesNotMatch(loader, /@swc-internal/);
    } finally {
        await rm(temporary, { force: true, recursive: true });
    }
});
