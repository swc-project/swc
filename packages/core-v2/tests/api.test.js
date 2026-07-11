const assert = require("node:assert/strict");
const test = require("node:test");

test("v2 omits removed APIs", () => {
    const api = require("../src/index.js");

    assert.equal(api.bundle, undefined);
    assert.equal(api.print, undefined);
    assert.equal(api.printSync, undefined);
    assert.equal(typeof api.transform, "function");
    assert.equal(typeof api.parse, "function");
    assert.equal(typeof api.minify, "function");
});
