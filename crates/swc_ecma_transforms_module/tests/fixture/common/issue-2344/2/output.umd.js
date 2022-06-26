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
    class A {
        // this is weird I know
        [(()=>void 0)()] = 123;
    }
    class B {
        // this is weird too I know
        [(()=>void 0)()]() {}
    }
    class C {
        static [(()=>void 0)()] = 1;
    }
    class D {
        static d = class {
            [(()=>this)()]() {}
        };
    }
});
