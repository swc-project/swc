(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(require("./copyPaste"));
    else if (typeof define === "function" && define.amd) define([
        "./copyPaste"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.copyPaste);
})(this, function(_copyPaste) {
    "use strict";
    class Thing {
        handleCopySomething() {
            (0, _copyPaste.copy)();
        }
        completelyUnrelated(copy = 123) {}
    }
});
