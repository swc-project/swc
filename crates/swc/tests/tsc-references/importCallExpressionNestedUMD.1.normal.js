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
        get: ()=>_default
    });
    const _default = "./foo";
});
//// [index.ts]
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("@swc/helpers/src/_async_to_generator.mjs"), require("@swc/helpers/src/_interop_require_wildcard.mjs"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "@swc/helpers/src/_async_to_generator.mjs",
        "@swc/helpers/src/_interop_require_wildcard.mjs"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.indexTs = {}, global.asyncToGeneratorMjs, global.interopRequireWildcardMjs);
})(this, function(exports, _asyncToGenerator, _interopRequireWildcard) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _asyncToGenerator = _asyncToGenerator.default;
    _interopRequireWildcard = _interopRequireWildcard.default;
    function foo() {
        return _foo.apply(this, arguments);
    }
    function _foo() {
        _foo = _asyncToGenerator(function*() {
            return yield import((yield import("./foo")).default);
        });
        return _foo.apply(this, arguments);
    }
});
