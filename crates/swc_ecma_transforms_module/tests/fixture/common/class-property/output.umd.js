(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("./files_with_swcrc/simple"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "./files_with_swcrc/simple"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.simple);
})(this, function(exports, _simple) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "Foo", {
        enumerable: true,
        get: function() {
            return Foo;
        }
    });
    class Foo {
        static prop = _simple.a;
    }
});
