(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory();
    else if (typeof define === "function" && define.amd) define([], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory();
})(this, function() {
    "use client";
    "foo";
    "use bar";
    "use strict";
    // All above are directives
    function foo() {}
    "use hello"; // This is not directive
});
