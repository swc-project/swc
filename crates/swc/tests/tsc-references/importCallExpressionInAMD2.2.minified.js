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
], function(require, exports, _interop_require_wildcard) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), _interop_require_wildcard = _interop_require_wildcard.default, function(x) {
        x.then((value)=>{
            new value.B().print();
        });
    }(new Promise((resolve, reject)=>require([
            "./0"
        ], (m)=>resolve(_interop_require_wildcard(m)), reject)));
});
