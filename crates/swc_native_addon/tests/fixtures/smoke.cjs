// Keep this fixture compatible with the oldest supported Node 10 runtime.
var assert = require("assert");
var path = process.argv[2];
var action = process.argv[3];
var original = { marker: "original exports" };
var moduleObject = { exports: original };
if (action === "success") {
    process.dlopen(moduleObject, path);
    assert.notStrictEqual(moduleObject.exports, original);
    assert.strictEqual(moduleObject.exports.initial, original);
    assert.strictEqual(moduleObject.exports.answer(), 42);
    setTimeout(function () {
        assert.strictEqual(moduleObject.exports.answer(), 42);
    }, 5);
} else {
    var caught;
    try {
        process.dlopen(moduleObject, path);
    } catch (error) {
        caught = error;
    }
    assert(caught, "registration must throw instead of returning empty exports");
    if (action === "raw-error") {
        assert.strictEqual(caught.code, "RAW_FIXTURE");
        assert.strictEqual(caught.message, "raw registration failed");
    } else {
        assert(/^ERR_SWC_NATIVE_/.test(caught.code), String(caught));
        assert(/SWC native addon/.test(caught.message));
    }
}
