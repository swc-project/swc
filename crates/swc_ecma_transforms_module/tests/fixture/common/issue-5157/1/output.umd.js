(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports);
    else if (typeof define === "function" && define.amd) define([
        "exports"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {});
})(this, function(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "foo", {
        enumerable: true,
        get: ()=>foo
    });
    const foo = {
        get prop1 () {
            return 1;
        },
        get prop2 () {
            return this.prop1 + 1;
        },
        set prop3 (v){
            this.x = v;
        },
        method () {
            return this.prop1;
        }
    };
});
