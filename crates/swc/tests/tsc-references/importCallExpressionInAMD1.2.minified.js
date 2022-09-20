//// [0.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    Object.defineProperty(exports, "foo", {
        enumerable: !0,
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
], function(require, exports, _interopRequireWildcard) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    Object.defineProperty(exports, "p2", {
        enumerable: !0,
        get: ()=>p2
    });
    _interopRequireWildcard = _interopRequireWildcard.default;
    new Promise((resolve, reject)=>require([
            "./0"
        ], (m)=>resolve(_interopRequireWildcard(m)), reject));
    new Promise((resolve, reject)=>require([
            "./0"
        ], (m)=>resolve(_interopRequireWildcard(m)), reject)).then((zero)=>zero.foo());
    var p2 = new Promise((resolve, reject)=>require([
            "./0"
        ], (m)=>resolve(_interopRequireWildcard(m)), reject));
});
