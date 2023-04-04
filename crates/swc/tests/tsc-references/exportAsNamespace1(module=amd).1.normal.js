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
        a: function() {
            return a;
        },
        b: function() {
            return b;
        }
    });
    var a = 1;
    var b = 2;
});
//// [1.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_interop_require_wildcard",
    "./0"
], function(require, exports, _interop_require_wildcard, _0) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "ns", {
        enumerable: true,
        get: function() {
            return _0;
        }
    });
    _0 = /*#__PURE__*/ _interop_require_wildcard._(_0);
    ns.a;
    ns.b;
});
//// [2.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_interop_require_wildcard",
    "./1"
], function(require, exports, _interop_require_wildcard, _1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _1 = /*#__PURE__*/ _interop_require_wildcard._(_1);
    _1.ns.a;
    _1.ns.b;
});
