(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(require("testlibrary"));
    else if (typeof define === "function" && define.amd) define([
        "testlibrary"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.testlibrary);
})(this, function(_testlibrary) {
    "use strict";
    console.log("aFunc: ", (0, _testlibrary.aFunc)(1, 2));
});
