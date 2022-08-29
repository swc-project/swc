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
        get: ()=>backup
    });
    function backup() {
        return "backup";
    }
});
//// [2.ts]
define([
    "require",
    "exports",
    "@swc/helpers/src/_interop_require_wildcard.mjs"
], function(require, exports, _interopRequireWildcard) {
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
        myModule = new Promise((resolve, reject)=>require([
                "./0"
            ], (m)=>resolve(/*#__PURE__*/ _interopRequireWildcard(m)), reject));
        method() {
            const loadAsync = new Promise((resolve, reject)=>require([
                    "./0"
                ], (m)=>resolve(/*#__PURE__*/ _interopRequireWildcard(m)), reject));
            this.myModule.then((Zero)=>{
                console.log(Zero.foo());
            }, async (err)=>{
                console.log(err);
                let one = await new Promise((resolve, reject)=>require([
                        "./1"
                    ], (m)=>resolve(/*#__PURE__*/ _interopRequireWildcard(m)), reject));
                console.log(one.backup());
            });
        }
    }
    class D {
        myModule = new Promise((resolve, reject)=>require([
                "./0"
            ], (m)=>resolve(/*#__PURE__*/ _interopRequireWildcard(m)), reject));
        method() {
            const loadAsync = new Promise((resolve, reject)=>require([
                    "./0"
                ], (m)=>resolve(/*#__PURE__*/ _interopRequireWildcard(m)), reject));
            this.myModule.then((Zero)=>{
                console.log(Zero.foo());
            }, async (err)=>{
                console.log(err);
                let one = await new Promise((resolve, reject)=>require([
                        "./1"
                    ], (m)=>resolve(/*#__PURE__*/ _interopRequireWildcard(m)), reject));
                console.log(one.backup());
            });
        }
    }
});
