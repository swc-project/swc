//// [exportClassNameWithObjectUMD.ts]
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("@swc/helpers/_/_class_call_check"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "@swc/helpers/_/_class_call_check"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.exportClassNameWithObjectUMDTs = {}, global.classCallCheck);
})(this, function(exports, _class_call_check) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "Object", {
        enumerable: true,
        get: function() {
            return Object;
        }
    });
    var Object = function Object() {
        "use strict";
        _class_call_check._(this, Object);
    };
});
