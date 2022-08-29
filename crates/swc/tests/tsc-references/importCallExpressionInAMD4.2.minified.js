//// [importCallExpressionInAMD4.ts]
define([
    "require"
], function(require) {});
//// [0.ts]
define([
    "require",
    "exports"
], function(require, exports) {
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
define([
    "require",
    "exports"
], function(require, exports) {
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
define([
    "require",
    "exports",
    "@swc/helpers/src/_interop_require_wildcard.mjs"
], function(require, exports, _interopRequireWildcard) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "D", {
        enumerable: !0,
        get: ()=>D
    }), _interopRequireWildcard = _interopRequireWildcard.default;
    class D {
        myModule = new Promise((resolve, reject)=>require([
                "./0"
            ], (m)=>resolve(_interopRequireWildcard(m)), reject));
        method() {
            new Promise((resolve, reject)=>require([
                    "./0"
                ], (m)=>resolve(_interopRequireWildcard(m)), reject)), this.myModule.then((Zero)=>{
                console.log(Zero.foo());
            }, async (err)=>{
                console.log(err);
                let one = await new Promise((resolve, reject)=>require([
                        "./1"
                    ], (m)=>resolve(_interopRequireWildcard(m)), reject));
                console.log(one.backup());
            });
        }
    }
});
