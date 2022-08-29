//// [exportClassNameWithObjectUMD.ts]
!function(global, factory) {
    "object" == typeof module && "object" == typeof module.exports ? factory(exports, require("@swc/helpers/src/_class_call_check.mjs")) : "function" == typeof define && define.amd ? define([
        "exports",
        "@swc/helpers/src/_class_call_check.mjs"
    ], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.exportClassNameWithObjectUMDTs = {}, global.classCallCheckMjs);
}(this, function(exports, _classCallCheck) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "Object", {
        enumerable: !0,
        get: function() {
            return Object;
        }
    }), _classCallCheck = _classCallCheck.default;
    var Object = function Object() {
        "use strict";
        _classCallCheck(this, Object);
    };
});
