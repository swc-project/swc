const assert = require("node:assert/strict");
const test = require("node:test");

const v1 = require("@swc/core");
const v2 = require("../src/index.js");

test("v1 and v2 use the same transform engine", () => {
    const source = "const answer: number = 40 + 2";
    const options = {
        filename: "answer.ts",
        jsc: { parser: { syntax: "typescript" }, target: "es2020" },
    };

    assert.deepEqual(
        v2.transformSync(source, options),
        v1.transformSync(source, options)
    );
    assert.ok(v2.getBinaryMetadata().target);
});

test("v2 ASTs round-trip without passing through the v1 JavaScript API", () => {
    const program = v2.parseSync("export const value = 1", {
        syntax: "ecmascript",
    });
    const output = v2.transformSync(program, {
        jsc: { target: "es2020" },
    });

    assert.match(output.code, /export const value = 1/);
});
