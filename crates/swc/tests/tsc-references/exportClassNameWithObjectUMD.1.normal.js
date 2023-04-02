//// [exportClassNameWithObjectUMD.ts]
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("@swc/helpers/src/_class_call_check.mjs"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "@swc/helpers/src/_class_call_check.mjs"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.exportClassNameWithObjectUMDTs = {}, global.classCallCheckMjs);
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
    _class_call_check = _class_call_check.default;
    var Object = function Object() {
        "use strict";
        _class_call_check(this, Object);
    };
});
