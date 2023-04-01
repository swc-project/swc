(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("./fn.js"), require("./fn2.js"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "./fn.js",
        "./fn2.js"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.fnJs, global.fn2Js);
})(this, function(exports, _fn, _fn2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _export_star(_fn, exports);
    _export_star(_fn2, exports);
});
