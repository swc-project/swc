import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(execFile);
const script = new URL("./stage-npm-v2.mjs", import.meta.url);

test("stages canonical v2 package identities", async () => {
    const temporary = await mkdtemp(path.join(os.tmpdir(), "swc-v2-stage-"));
    try {
        await exec(process.execPath, [
            script.pathname,
            "2.0.0-next.7",
            temporary,
        ]);

        const core = JSON.parse(
            await readFile(path.join(temporary, "core/package.json"))
        );
        const types = JSON.parse(
            await readFile(path.join(temporary, "types/package.json"))
        );
        const platform = JSON.parse(
            await readFile(
                path.join(temporary, "platform/darwin-arm64/package.json")
            )
        );

        assert.equal(core.name, "@swc/core");
        assert.equal(core.private, undefined);
        assert.equal(core.dependencies["@swc/types"], "2.0.0-next.7");
        assert.equal(core.optionalDependencies["@swc/wasm"], "2.0.0-next.7");
        assert.equal(
            core.optionalDependencies["@swc/core-darwin-arm64"],
            "2.0.0-next.7"
        );
        assert.equal(types.name, "@swc/types");
        assert.equal(platform.name, "@swc/core-darwin-arm64");
        assert.equal(platform.version, "2.0.0-next.7");
    } finally {
        await rm(temporary, { force: true, recursive: true });
    }
});
