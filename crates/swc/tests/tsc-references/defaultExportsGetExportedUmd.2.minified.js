//// [a.ts]
!function(global, factory) {
    "object" == typeof module && "object" == typeof module.exports ? factory(exports) : "function" == typeof define && define.amd ? define([
        "exports"
    ], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.aTs = {});
}(this, function(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "default", {
        enumerable: !0,
        get: ()=>Foo
    });
    class Foo {
    }
});
//// [b.ts]
!function(global, factory) {
    "object" == typeof module && "object" == typeof module.exports ? factory(exports) : "function" == typeof define && define.amd ? define([
        "exports"
    ], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.bTs = {});
}(this, function(exports) {
    "use strict";
    function foo() {}
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "default", {
        enumerable: !0,
        get: ()=>foo
    });
});
