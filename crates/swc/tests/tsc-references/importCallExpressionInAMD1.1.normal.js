//// [0.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "foo", {
        enumerable: true,
        get: ()=>foo
    });
    function foo() {
        return "foo";
    }
});
//// [1.ts]
define([
    "require",
    "exports",
    "@swc/helpers/src/_interop_require_wildcard.mjs"
], function(require, exports, _interop_require_wildcard) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "p2", {
        enumerable: true,
        get: ()=>p2
    });
    _interop_require_wildcard = _interop_require_wildcard.default;
    new Promise((resolve, reject)=>require([
            "./0"
        ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard(m)), reject));
    var p1 = new Promise((resolve, reject)=>require([
            "./0"
        ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard(m)), reject));
    p1.then((zero)=>{
        return zero.foo();
    });
    var p2 = new Promise((resolve, reject)=>require([
            "./0"
        ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard(m)), reject));
    function foo() {
        const p2 = new Promise((resolve, reject)=>require([
                "./0"
            ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard(m)), reject));
    }
});
