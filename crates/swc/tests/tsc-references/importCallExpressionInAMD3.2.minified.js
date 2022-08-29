//// [0.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "B", {
        enumerable: !0,
        get: ()=>B
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
    "@swc/helpers/src/_interop_require_wildcard.mjs"
], function(require, exports, _interopRequireWildcard) {
    "use strict";
    async function foo() {
        class C extends (await new Promise((resolve, reject)=>require([
                "./0"
            ], (m)=>resolve(_interopRequireWildcard(m)), reject))).B {
        }
        new C().print();
    }
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), _interopRequireWildcard = _interopRequireWildcard.default, foo();
});
