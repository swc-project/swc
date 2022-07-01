(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("path"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "path"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.path);
})(this, function(exports, _path) {
    "use strict";
    Object.defineProperty(exports, "foo", {
        enumerable: true,
        get: ()=>foo
    });
    const foo = function() {
        function e(t) {}
        return A(e, {}), e;
    }();
});
