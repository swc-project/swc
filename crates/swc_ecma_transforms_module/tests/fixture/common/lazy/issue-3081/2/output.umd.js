(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("lib"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "lib"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.lib);
})(this, function(_lib) {
    "use strict";
    function myFn() {
        (0, _lib.fn)();
    }
    class MyClass extends _lib.Klass {
    }
});
