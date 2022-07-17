(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("./Z"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "./Z"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.z);
})(this, function(exports, _z) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "X", {
        enumerable: true,
        get: ()=>_z.default
    });
    _z = /*#__PURE__*/ _interopRequireDefault(_exportStar(_z, exports));
});
