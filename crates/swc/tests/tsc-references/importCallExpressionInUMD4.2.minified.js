//// [0.ts]
var global, factory;
global = this, factory = function(exports1) {
    Object.defineProperty(exports1, "__esModule", {
        value: !0
    }), function(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: !0,
            get: all[name]
        });
    }(exports1, {
        B: function() {
            return B;
        },
        foo: function() {
            return foo;
        }
    });
    class B {
        print() {
            return "I am B";
        }
    }
    function foo() {
        return "foo";
    }
}, "object" == typeof module && "object" == typeof module.exports ? factory(exports) : "function" == typeof define && define.amd ? define([
    "exports"
], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.0Ts = {});
//// [1.ts]
var global, factory;
global = this, factory = function(exports1) {
    function backup() {
        return "backup";
    }
    Object.defineProperty(exports1, "__esModule", {
        value: !0
    }), Object.defineProperty(exports1, "backup", {
        enumerable: !0,
        get: function() {
            return backup;
        }
    });
}, "object" == typeof module && "object" == typeof module.exports ? factory(exports) : "function" == typeof define && define.amd ? define([
    "exports"
], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.1Ts = {});
//// [2.ts]
var global, factory;
global = this, factory = function(exports1, _interop_require_wildcard) {
    Object.defineProperty(exports1, "__esModule", {
        value: !0
    }), Object.defineProperty(exports1, "D", {
        enumerable: !0,
        get: function() {
            return D;
        }
    });
    class D {
        method() {
            import("./0"), this.myModule.then((Zero)=>{
                console.log(Zero.foo());
            }, async (err)=>{
                console.log(err), console.log((await import("./1")).backup());
            });
        }
        constructor(){
            this.myModule = import("./0");
        }
    }
}, "object" == typeof module && "object" == typeof module.exports ? factory(exports, require("@swc/helpers/_/_interop_require_wildcard")) : "function" == typeof define && define.amd ? define([
    "exports",
    "@swc/helpers/_/_interop_require_wildcard"
], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.2Ts = {}, global.interopRequireWildcard);
