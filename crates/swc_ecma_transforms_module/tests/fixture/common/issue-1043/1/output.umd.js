(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("./http"), require("./interfaces"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "./http",
        "./interfaces"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.http, global.interfaces);
})(this, function(exports, _http, _interfaces) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "Scope", {
        enumerable: true,
        get: ()=>_interfaces.Scope
    });
    _exportStar(_http, exports);
});
