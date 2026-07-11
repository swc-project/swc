const assert = require("node:assert/strict");

const wasm = require("../pkg");

it("exports the v2 Wasm API", () => {
    assert.equal(wasm.print, undefined);
    assert.equal(wasm.printSync, undefined);
    assert.equal(typeof wasm.transformSync, "function");

    const output = wasm.transformSync("const value: number = 1", {
        filename: "input.ts",
        jsc: { parser: { syntax: "typescript" } },
    });
    assert.match(output.code, /value = 1/);
});
