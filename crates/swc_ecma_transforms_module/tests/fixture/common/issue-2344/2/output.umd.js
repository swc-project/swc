(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory();
    else if (typeof define === "function" && define.amd) define([], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory();
})(this, function() {
    "use strict";
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
