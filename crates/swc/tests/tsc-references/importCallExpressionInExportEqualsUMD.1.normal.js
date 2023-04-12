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
    if (typeof module === "object" && typeof module.exports === "object") module.exports = factory(require("@swc/helpers/_/_interop_require_wildcard"));
    else if (typeof define === "function" && define.amd) define([
        "@swc/helpers/_/_interop_require_wildcard"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) module.exports = factory(global.interopRequireWildcard);
})(this, function(_interop_require_wildcard) {
    "use strict";
    return async function() {
        const something = await import("./something");
    };
});
