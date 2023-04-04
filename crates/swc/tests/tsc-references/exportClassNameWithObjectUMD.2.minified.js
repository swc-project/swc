//// [exportClassNameWithObjectUMD.ts]
!function(global, factory) {
    "object" == typeof module && "object" == typeof module.exports ? factory(exports, require("@swc/helpers/_/_class_call_check")) : "function" == typeof define && define.amd ? define([
        "exports",
        "@swc/helpers/_/_class_call_check"
    ], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.exportClassNameWithObjectUMDTs = {}, global.classCallCheck);
}(this, function(exports1, _class_call_check) {
    "use strict";
    Object.defineProperty(exports1, "__esModule", {
        value: !0
    }), Object.defineProperty(exports1, "Object", {
        enumerable: !0,
        get: function() {
            return Object;
        }
    });
    var Object = function Object() {
        "use strict";
        _class_call_check._(this, Object);
    };
});
