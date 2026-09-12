// This child intentionally uses Node 10.0-compatible syntax and built-ins.
// Instrument only the test process: production JS loaders remain untouched.
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const product = process.argv[2];
const entry = path.resolve(process.argv[3]);
const expected = fs.realpathSync(path.resolve(process.argv[4]));
const target = process.argv[5];
const loaded = [];
const dlopen = process.dlopen;
process.dlopen = function (module, filename) {
    loaded.push(fs.realpathSync(filename));
    // Preserve argument count: passing an explicit undefined flag changes Node's dlopen mode.
    return dlopen.apply(process, arguments);
};
delete process.env.SWC_BINARY_PATH;
delete process.env.NAPI_RS_NATIVE_LIBRARY_PATH;

async function main() {
    const start = process.hrtime();
    const api = require(entry);
    const elapsed = process.hrtime(start);
    const loadMs = elapsed[0] * 1000 + elapsed[1] / 1e6;
    assert(
        loaded.indexOf(expected) !== -1,
        "expected addon was not loaded: " + expected
    );
    assert.deepStrictEqual(
        loaded,
        [expected],
        "another native addon masked the selected artifact"
    );
    const binding = require(expected);
    if (product === "core") {
        assert.strictEqual(binding.getTargetTriple(), target);
        assert(
            /var answer/.test(
                api.transformSync("const answer: number = 42", {
                    jsc: { parser: { syntax: "typescript" }, target: "es5" },
                }).code
            )
        );
    } else if (product === "html") {
        const result = api.minifySync(
            "<!doctype html><html><body><!-- remove --><p>hello</p></body></html>",
            { removeComments: true }
        );
        assert(result.code.indexOf("hello") !== -1);
        assert(result.code.indexOf("remove") === -1);
    } else if (product === "minifier") {
        const result = api.minifySync(
            "const answer = 40 + 2; console.log(answer)",
            { compress: true, mangle: false }
        );
        assert(result.code.indexOf("42") !== -1);
    } else if (product === "react-compiler") {
        assert.strictEqual(
            api.isReactCompilerRequiredSync(
                Buffer.from(
                    'import * as React from "react"; export function useCounter() { return React.useState(0); }'
                )
            ),
            true
        );
        assert.strictEqual(
            await api.isReactCompilerRequired(
                Buffer.from("export const answer = 42;")
            ),
            false
        );
    } else {
        throw new Error("unknown product " + product);
    }
    console.log(
        JSON.stringify({
            node: process.version,
            loadMs,
            exports: Object.keys(binding).sort(),
        })
    );
}
main().catch(function (error) {
    console.error(error);
    process.exitCode = 1;
});
