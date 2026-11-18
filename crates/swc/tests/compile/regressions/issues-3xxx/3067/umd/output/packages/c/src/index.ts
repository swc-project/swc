// Simulate accessing a .js file in a third party package that shouldn't be edited
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("@swc/helpers/_/_interop_require_default"), require("lodash/dist/something.js"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "@swc/helpers/_/_interop_require_default",
        "lodash/dist/something.js"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.index = {}, global.interopRequireDefault, global.somethingJs);
})(this, function(exports, _interop_require_default, _something) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "displayC", {
        enumerable: true,
        get: function() {
            return displayC;
        }
    });
    _something = /*#__PURE__*/ _interop_require_default._(_something);
    function displayC() {
        (0, _something.default)();
        return 'Display C';
    }
});
