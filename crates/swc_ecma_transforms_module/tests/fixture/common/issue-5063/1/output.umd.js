(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory();
    else if (typeof define === "function" && define.amd) define([], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory();
})(this, function() {
    "use strict";
    class Foo {
        bar = 5;
        getThing(a, b = this.bar) {
            return a + b;
        }
    }
});
