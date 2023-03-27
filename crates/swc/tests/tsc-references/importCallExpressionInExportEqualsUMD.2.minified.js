//// [something.ts]
!function(global, factory) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = factory() : "function" == typeof define && define.amd ? define([], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && (module.exports = factory());
}(this, function() {
    return 42;
});
//// [index.ts]
!function(global, factory) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = factory(require("@swc/helpers/src/_interop_require_wildcard.mjs")) : "function" == typeof define && define.amd ? define([
        "@swc/helpers/src/_interop_require_wildcard.mjs"
    ], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && (module.exports = factory(global.interopRequireWildcardMjs));
}(this, function(_interop_require_wildcard) {
    return _interop_require_wildcard = _interop_require_wildcard.default, async function() {
        await import("./something");
    };
});
