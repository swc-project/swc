//// [foo.ts]
!function(global, factory) {
    "object" == typeof module && "object" == typeof module.exports ? factory(exports) : "function" == typeof define && define.amd ? define([
        "exports"
    ], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.fooTs = {});
}(this, function(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "default", {
        enumerable: !0,
        get: function() {
            return _default;
        }
    });
    var _default = "./foo";
});
//// [index.ts]
!function(global, factory) {
    "object" == typeof module && "object" == typeof module.exports ? factory(exports, require("@swc/helpers/src/_async_to_generator.mjs"), require("@swc/helpers/src/_interop_require_wildcard.mjs"), require("@swc/helpers/src/_ts_generator.mjs")) : "function" == typeof define && define.amd ? define([
        "exports",
        "@swc/helpers/src/_async_to_generator.mjs",
        "@swc/helpers/src/_interop_require_wildcard.mjs",
        "@swc/helpers/src/_ts_generator.mjs"
    ], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.indexTs = {}, global.asyncToGeneratorMjs, global.interopRequireWildcardMjs, global.tsGeneratorMjs);
}(this, function(exports, _asyncToGenerator, _interopRequireWildcard, _tsGenerator) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), _asyncToGenerator = _asyncToGenerator.default, _interopRequireWildcard = _interopRequireWildcard.default, _tsGenerator = _tsGenerator.default;
});
