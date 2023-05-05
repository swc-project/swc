//// [importCallExpressionInAMD4.ts]
define([
    "require"
], function(require) {
    "use strict";
});
//// [0.ts]
define([
    "require",
    "exports"
], function(require, exports) {
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
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "backup", {
        enumerable: true,
        get: function() {
            return backup;
        }
    });
    function backup() {
        return "backup";
    }
});
//// [2.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_interop_require_wildcard"
], function(require, exports, _interop_require_wildcard) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "D", {
        enumerable: true,
        get: function() {
            return D;
        }
    });
    class C {
        method() {
            const loadAsync = new Promise((resolve, reject)=>require([
                    "./0"
                ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject));
            this.myModule.then((Zero)=>{
                console.log(Zero.foo());
            }, async (err)=>{
                console.log(err);
                let one = await new Promise((resolve, reject)=>require([
                        "./1"
                    ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject));
                console.log(one.backup());
            });
        }
        constructor(){
            this.myModule = new Promise((resolve, reject)=>require([
                    "./0"
                ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject));
        }
    }
    class D {
        method() {
            const loadAsync = new Promise((resolve, reject)=>require([
                    "./0"
                ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject));
            this.myModule.then((Zero)=>{
                console.log(Zero.foo());
            }, async (err)=>{
                console.log(err);
                let one = await new Promise((resolve, reject)=>require([
                        "./1"
                    ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject));
                console.log(one.backup());
            });
        }
        constructor(){
            this.myModule = new Promise((resolve, reject)=>require([
                    "./0"
                ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject));
        }
    }
});
