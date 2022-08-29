//// [0.ts]
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports);
    else if (typeof define === "function" && define.amd) define([
        "exports"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.0Ts = {});
})(this, function(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "foo", {
        enumerable: true,
        get: ()=>foo
    });
    function foo() {
        return "foo";
    }
});
//// [1.ts]
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("@swc/helpers/src/_interop_require_wildcard.mjs"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "@swc/helpers/src/_interop_require_wildcard.mjs"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.1Ts = {}, global.interopRequireWildcardMjs);
})(this, function(exports, _interopRequireWildcard) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "p2", {
        enumerable: true,
        get: ()=>p2
    });
    _interopRequireWildcard = _interopRequireWildcard.default;
    import("./0");
    var p1 = import("./0");
    p1.then((zero)=>{
        return zero.foo();
    });
    var p2 = import("./0");
    function foo() {
        const p2 = import("./0");
    }
});
