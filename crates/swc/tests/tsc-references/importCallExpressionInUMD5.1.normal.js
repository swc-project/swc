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
// https://github.com/microsoft/TypeScript/issues/36780
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("@swc/helpers/src/_async_to_generator.mjs"), require("@swc/helpers/src/_interop_require_wildcard.mjs"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "@swc/helpers/src/_async_to_generator.mjs",
        "@swc/helpers/src/_interop_require_wildcard.mjs"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.1Ts = {}, global.asyncToGeneratorMjs, global.interopRequireWildcardMjs);
})(this, function(exports, _asyncToGenerator, _interopRequireWildcard) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _asyncToGenerator = _asyncToGenerator.default;
    _interopRequireWildcard = _interopRequireWildcard.default;
    function func() {
        return _func.apply(this, arguments);
    }
    function _func() {
        _func = _asyncToGenerator(function*() {
            const packageName = '.';
            const packageJson = yield import(packageName + '/package.json');
        });
        return _func.apply(this, arguments);
    }
});
