//// [0.ts]
!function(global, factory) {
    "object" == typeof module && "object" == typeof module.exports ? factory(exports) : "function" == typeof define && define.amd ? define([
        "exports"
    ], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.0Ts = {});
}(this, function(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), function(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: !0,
            get: all[name]
        });
    }(exports, {
        B: ()=>B,
        foo: ()=>foo
    });
    class B {
        print() {
            return "I am B";
        }
    }
    function foo() {
        return "foo";
    }
});
//// [1.ts]
!function(global, factory) {
    "object" == typeof module && "object" == typeof module.exports ? factory(exports) : "function" == typeof define && define.amd ? define([
        "exports"
    ], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.1Ts = {});
}(this, function(exports) {
    "use strict";
    function backup() {
        return "backup";
    }
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "backup", {
        enumerable: !0,
        get: ()=>backup
    });
});
//// [2.ts]
!function(global, factory) {
    "object" == typeof module && "object" == typeof module.exports ? factory(exports, require("@swc/helpers/src/_interop_require_wildcard.mjs")) : "function" == typeof define && define.amd ? define([
        "exports",
        "@swc/helpers/src/_interop_require_wildcard.mjs"
    ], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.2Ts = {}, global.interopRequireWildcardMjs);
}(this, function(exports, _interopRequireWildcard) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "D", {
        enumerable: !0,
        get: ()=>D
    }), _interopRequireWildcard = _interopRequireWildcard.default;
    class D {
        myModule = import("./0");
        method() {
            import("./0"), this.myModule.then((Zero)=>{
                console.log(Zero.foo());
            }, async (err)=>{
                console.log(err);
                let one = await import("./1");
                console.log(one.backup());
            });
        }
    }
});
