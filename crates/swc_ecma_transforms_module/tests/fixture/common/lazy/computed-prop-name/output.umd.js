(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("libx"), require("liby"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "libx",
        "liby"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.libx, global.liby);
})(this, function(_libx, _liby) {
    "use strict";
    class F {
        get [_libx.x]() {}
        get y() {
            (0, _liby.y)();
        }
    }
});
