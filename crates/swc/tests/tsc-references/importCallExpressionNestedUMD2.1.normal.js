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
    var _default = "./foo";
});
//// [index.ts]
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("@swc/helpers/src/_async_to_generator.mjs"), require("@swc/helpers/src/_interop_require_wildcard.mjs"), require("@swc/helpers/src/_ts_generator.mjs"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "@swc/helpers/src/_async_to_generator.mjs",
        "@swc/helpers/src/_interop_require_wildcard.mjs",
        "@swc/helpers/src/_ts_generator.mjs"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.indexTs = {}, global.asyncToGeneratorMjs, global.interopRequireWildcardMjs, global.tsGeneratorMjs);
})(this, function(exports, _asyncToGenerator, _interopRequireWildcard, _tsGenerator) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _asyncToGenerator = _asyncToGenerator.default;
    _interopRequireWildcard = _interopRequireWildcard.default;
    _tsGenerator = _tsGenerator.default;
    function foo() {
        return _foo.apply(this, arguments);
    }
    function _foo() {
        _foo = _asyncToGenerator(function() {
            return _tsGenerator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            import("./foo")
                        ];
                    case 1:
                        return [
                            4,
                            import(_state.sent().default)
                        ];
                    case 2:
                        return [
                            2,
                            _state.sent()
                        ];
                }
            });
        });
        return _foo.apply(this, arguments);
    }
});
