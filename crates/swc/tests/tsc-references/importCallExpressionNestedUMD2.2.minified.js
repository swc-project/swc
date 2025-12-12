//// [foo.ts]
var global, factory;
global = this, factory = function(exports1) {
    Object.defineProperty(exports1, "__esModule", {
        value: !0
    }), Object.defineProperty(exports1, "default", {
        enumerable: !0,
        get: function() {
            return _default;
        }
    });
    var _default = "./foo";
}, "object" == typeof module && "object" == typeof module.exports ? factory(exports) : "function" == typeof define && define.amd ? define([
    "exports"
], factory) : (global = "u" > typeof globalThis ? globalThis : global || self) && factory(global.fooTs = {});
//// [index.ts]
var global, factory;
global = this, factory = function(exports1, _async_to_generator, _interop_require_wildcard, _ts_generator) {
    Object.defineProperty(exports1, "__esModule", {
        value: !0
    });
}, "object" == typeof module && "object" == typeof module.exports ? factory(exports, require("@swc/helpers/_/_async_to_generator"), require("@swc/helpers/_/_interop_require_wildcard"), require("@swc/helpers/_/_ts_generator")) : "function" == typeof define && define.amd ? define([
    "exports",
    "@swc/helpers/_/_async_to_generator",
    "@swc/helpers/_/_interop_require_wildcard",
    "@swc/helpers/_/_ts_generator"
], factory) : (global = "u" > typeof globalThis ? globalThis : global || self) && factory(global.indexTs = {}, global.asyncToGenerator, global.interopRequireWildcard, global.tsGenerator);
