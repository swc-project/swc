(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("libx"), require("liby"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "libx",
        "liby"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.libx, global.liby);
})(this, function(exports, _libx, _liby) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    class F {
        get [_libx.x]() {}
        get y() {
            (0, _liby.y)();
        }
    }
});
