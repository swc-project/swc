//// [something.ts]
var global, factory;
global = this, factory = function() {
    return 42;
}, "object" == typeof module && "object" == typeof module.exports ? module.exports = factory() : "function" == typeof define && define.amd ? define([], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && (module.exports = factory());
//// [index.ts]
var global, factory;
global = this, factory = function(_interop_require_wildcard) {
    return async function() {
        await import("./something");
    };
}, "object" == typeof module && "object" == typeof module.exports ? module.exports = factory(require("@swc/helpers/_/_interop_require_wildcard")) : "function" == typeof define && define.amd ? define([
    "@swc/helpers/_/_interop_require_wildcard"
], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && (module.exports = factory(global.interopRequireWildcard));
