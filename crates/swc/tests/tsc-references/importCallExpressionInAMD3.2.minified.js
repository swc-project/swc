//// [0.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "B", {
        enumerable: !0,
        get: function() {
            return B;
        }
    });
    class B {
        print() {
            return "I am B";
        }
    }
});
//// [2.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_interop_require_wildcard"
], function(require, exports, _interop_require_wildcard) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), async function() {
        class C extends (await new Promise((resolve, reject)=>require([
                "./0"
            ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject))).B {
        }
        new C().print();
    }();
});
