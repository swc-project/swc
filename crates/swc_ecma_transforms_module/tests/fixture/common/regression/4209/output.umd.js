(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("./copyPaste"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "./copyPaste"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.copyPaste);
})(this, function(exports, _copyPaste) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    class Thing {
        handleCopySomething() {
            (0, _copyPaste.copy)();
        }
        completelyUnrelated(copy = 123) {}
    }
});
