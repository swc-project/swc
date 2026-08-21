const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");

const v2 = require("../src/index.js");

test("v2 executes plugins compiled against the v1 schema", () => {
    const plugin = path.resolve(
        __dirname,
        "../../core/e2e/fixtures/plugin_analyze/target/wasm32-wasip1/debug/plugin_analyze.wasm"
    );
    const output = v2.transformSync("console.log('original')", {
        jsc: {
            experimental: {
                plugins: [[plugin, {}]],
            },
        },
    });

    assert.match(output.code, /console\.log\(['\"]original['\"]\)/);
});
