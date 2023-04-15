//// [foo.ts]
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports);
    else if (typeof define === "function" && define.amd) define([
        "exports"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.fooTs = {});
})(this, function(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "default", {
        enumerable: true,
        get: function() {
            return _default;
        }
    });
    const _default = "./foo";
});
//// [index.ts]
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("@swc/helpers/_/_async_to_generator"), require("@swc/helpers/_/_interop_require_wildcard"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "@swc/helpers/_/_async_to_generator",
        "@swc/helpers/_/_interop_require_wildcard"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.indexTs = {}, global.asyncToGenerator, global.interopRequireWildcard);
})(this, function(exports, _async_to_generator, _interop_require_wildcard) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function foo() {
        return _foo.apply(this, arguments);
    }
    function _foo() {
        _foo = _async_to_generator._(function*() {
            return yield import((yield import("./foo")).default);
        });
        return _foo.apply(this, arguments);
    }
});
