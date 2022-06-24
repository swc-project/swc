(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("path"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "path"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.path);
})(this, function(exports, _path) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "foo", {
        get: ()=>foo,
        enumerable: true
    });
    const foo = function() {
        var e = 1;
        return A(e, {}), e;
    }();
});
