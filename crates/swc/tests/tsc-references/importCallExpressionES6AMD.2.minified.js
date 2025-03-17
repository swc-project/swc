//// [0.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    function foo() {
        return "foo";
    }
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "foo", {
        enumerable: !0,
        get: function() {
            return foo;
        }
    });
});
//// [1.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_interop_require_wildcard"
], function(require, exports, _interop_require_wildcard) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var all = {
        D: function() {
            return D;
        },
        p2: function() {
            return p2;
        }
    };
    for(var name in all)Object.defineProperty(exports, name, {
        enumerable: !0,
        get: all[name]
    });
    new Promise((resolve, reject)=>require([
            "./0"
        ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject)), new Promise((resolve, reject)=>require([
            "./0"
        ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject)).then((zero)=>zero.foo());
    var p2 = new Promise((resolve, reject)=>require([
            "./0"
        ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject));
    class D {
        method() {
            new Promise((resolve, reject)=>require([
                    "./0"
                ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject));
        }
    }
});
