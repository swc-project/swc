//// [0.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "B", {
        enumerable: true,
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
], function(require, exports, _interop_require_wildcard) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _interop_require_wildcard = _interop_require_wildcard.default;
    async function foo() {
        class C extends (await new Promise((resolve, reject)=>require([
                "./0"
            ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard(m)), reject))).B {
        }
        var c = new C();
        c.print();
    }
    foo();
});
