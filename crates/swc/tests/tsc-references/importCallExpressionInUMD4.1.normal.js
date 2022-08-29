//// [0.ts]
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports);
    else if (typeof define === "function" && define.amd) define([
        "exports"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.0Ts = {});
})(this, function(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
        });
    }
    _export(exports, {
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
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports);
    else if (typeof define === "function" && define.amd) define([
        "exports"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.1Ts = {});
})(this, function(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "backup", {
        enumerable: true,
        get: ()=>backup
    });
    function backup() {
        return "backup";
    }
});
//// [2.ts]
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("@swc/helpers/src/_interop_require_wildcard.mjs"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "@swc/helpers/src/_interop_require_wildcard.mjs"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.2Ts = {}, global.interopRequireWildcardMjs);
})(this, function(exports, _interopRequireWildcard) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "D", {
        enumerable: true,
        get: ()=>D
    });
    _interopRequireWildcard = _interopRequireWildcard.default;
    class C {
        myModule = import("./0");
        method() {
            const loadAsync = import("./0");
            this.myModule.then((Zero)=>{
                console.log(Zero.foo());
            }, async (err)=>{
                console.log(err);
                let one = await import("./1");
                console.log(one.backup());
            });
        }
    }
    class D {
        myModule = import("./0");
        method() {
            const loadAsync = import("./0");
            this.myModule.then((Zero)=>{
                console.log(Zero.foo());
            }, async (err)=>{
                console.log(err);
                let one = await import("./1");
                console.log(one.backup());
            });
        }
    }
});
