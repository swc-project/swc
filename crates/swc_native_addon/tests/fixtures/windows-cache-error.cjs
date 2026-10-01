// Keep the require() diagnostic fixture compatible with Node 10.
var assert = require("assert");
var path = require("path");
var caught;
try {
    require(process.argv[2]);
} catch (error) {
    caught = error;
}
assert(caught, "unsafe default and profile roots must fail");
assert.strictEqual(caught.code, "ERR_SWC_NATIVE_CACHE");
assert(caught.message.indexOf(path.join(process.env.LOCALAPPDATA, "swc")) !== -1);
assert(caught.message.indexOf(path.join(process.env.USERPROFILE, ".swc-cache")) !== -1);
assert(caught.message.indexOf("S-1-15-3-1") !== -1);
assert(caught.message.indexOf("S-1-5-11") !== -1);
assert(caught.message.indexOf("SWC_NATIVE_BINDING_CACHE") !== -1);
