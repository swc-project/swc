//// [something.ts]
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") module.exports = factory();
    else if (typeof define === "function" && define.amd) define([], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) module.exports = factory();
})(this, function() {
    "use strict";
    return 42;
});
//// [index.ts]
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") module.exports = factory(require("@swc/helpers/src/_interop_require_wildcard.mjs"));
    else if (typeof define === "function" && define.amd) define([
        "@swc/helpers/src/_interop_require_wildcard.mjs"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) module.exports = factory(global.interopRequireWildcardMjs);
})(this, function(_interop_require_wildcard) {
    "use strict";
    _interop_require_wildcard = _interop_require_wildcard.default;
    return async function() {
        const something = await import("./something");
    };
});
