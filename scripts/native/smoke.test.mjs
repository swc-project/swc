import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { win32 } from "node:path";
import { runInNewContext } from "node:vm";

test("Windows smoke canonicalizes drive and namespace paths and preserves dlopen arguments", async () => {
    const source = readFileSync(
        new URL("./smoke.cjs", import.meta.url),
        "utf8"
    );
    for (const drive of ["C", "D"])
        for (const flags of [[], [42]]) {
            const entry = drive + ":\\package\\index.js";
            const addon = drive + ":\\package\\binding.node";
            const namespaced = win32.toNamespacedPath(addon);
            const seen = [];
            const module = {};
            let originalArgs;
            const api = { minifySync: () => ({ code: "console.log(42)" }) };
            const child = {
                argv: [
                    "node",
                    "smoke.cjs",
                    "minifier",
                    entry,
                    addon,
                    "x86_64-pc-windows-msvc",
                ],
                env: {},
                hrtime: process.hrtime,
                version: process.version,
                dlopen(...args) {
                    assert.equal(this, child);
                    originalArgs = args;
                },
            };
            const realpathSync = () => {
                throw new Error(
                    "JS realpath must not inspect a bare Windows drive"
                );
            };
            realpathSync.native = (path) => {
                seen.push(path);
                assert([addon, namespaced].includes(path));
                return namespaced;
            };
            let output;
            await runInNewContext(source, {
                process: child,
                console: {
                    log(value) {
                        output = JSON.parse(value);
                    },
                    error(error) {
                        throw error;
                    },
                },
                require(name) {
                    if (name === "assert") return assert;
                    if (name === "fs") return { realpathSync };
                    if (name === "path") return win32;
                    if (name === entry) {
                        child.dlopen(module, namespaced, ...flags);
                        return api;
                    }
                    if (name === namespaced) return api;
                    throw new Error("unexpected require " + name);
                },
            });
            assert.deepEqual(seen, [addon, namespaced]);
            assert.deepEqual(originalArgs, [module, namespaced, ...flags]);
            assert.deepEqual(output.exports, ["minifySync"]);
        }
});
