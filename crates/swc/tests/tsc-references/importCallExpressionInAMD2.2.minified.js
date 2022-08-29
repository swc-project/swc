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
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), _interopRequireWildcard = _interopRequireWildcard.default, function(x) {
        x.then((value)=>{
            new value.B().print();
        });
    }(new Promise((resolve, reject)=>require([
            "./0"
        ], (m)=>resolve(_interopRequireWildcard(m)), reject)));
});
