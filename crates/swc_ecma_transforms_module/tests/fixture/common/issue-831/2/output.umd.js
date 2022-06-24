(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory();
    else if (typeof define === "function" && define.amd) define([], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory();
})(this, function() {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "myGenerator", {
        get: ()=>myGenerator,
        enumerable: true
    });
    function* myGenerator() {
        yield* [
            1,
            2,
            3
        ];
    }
});
