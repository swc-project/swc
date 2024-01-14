//// [index.js]
// @ts-nocheck
function foo() {
    module.exports = exports = function exports1(o) {
        return o == null ? create(base) : defineProperties(Object(o), descriptors);
    };
    var m = function m() {
    // I have no idea what to put here
    };
    exports.methods = m;
}
