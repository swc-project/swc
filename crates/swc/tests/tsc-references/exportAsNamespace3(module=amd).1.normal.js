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
    "@swc/helpers/src/_interop_require_wildcard.mjs",
    "./0"
], function(require, exports, _interopRequireWildcard, _0) {
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
    _interopRequireWildcard = _interopRequireWildcard.default;
    _0 = /*#__PURE__*/ _interopRequireWildcard(_0);
    ns.a;
    ns.b;
    var ns = {
        a: 1,
        b: 2
    };
    ns.a;
    ns.b;
});
//// [2.ts]
define([
    "require",
    "exports",
    "@swc/helpers/src/_interop_require_wildcard.mjs",
    "./1"
], function(require, exports, _interopRequireWildcard, _1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _interopRequireWildcard = _interopRequireWildcard.default;
    _1 = /*#__PURE__*/ _interopRequireWildcard(_1);
    _1.ns.a;
    _1.ns.b;
});
