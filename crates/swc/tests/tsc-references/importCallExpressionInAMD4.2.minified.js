//// [importCallExpressionInAMD4.ts]
define([
    "require"
], function(require) {});
//// [0.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), function(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: !0,
            get: all[name]
        });
    }(exports, {
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
});
//// [1.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    function backup() {
        return "backup";
    }
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "backup", {
        enumerable: !0,
        get: function() {
            return backup;
        }
    });
});
//// [2.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_interop_require_wildcard"
], function(require, exports, _interop_require_wildcard) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "D", {
        enumerable: !0,
        get: function() {
            return D;
        }
    });
    class D {
        method() {
            new Promise((resolve, reject)=>require([
                    "./0"
                ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject)), this.myModule.then((Zero)=>{
                console.log(Zero.foo());
            }, async (err)=>{
                console.log(err), console.log((await new Promise((resolve, reject)=>require([
                        "./1"
                    ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject))).backup());
            });
        }
        constructor(){
            this.myModule = new Promise((resolve, reject)=>require([
                    "./0"
                ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject));
        }
    }
});
