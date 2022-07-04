(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("external"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "external"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.external);
})(this, function(exports, _external) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
        });
    }
    _export(exports, {
        default: ()=>_external.default,
        foo: ()=>_external.default
    });
    _external = /*#__PURE__*/ _interopRequireDefault(_external);
});
