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
    Object.defineProperty(exports, "default", {
        enumerable: true,
        get: function() {
            return _0;
        }
    });
    _0 = /*#__PURE__*/ _interop_require_wildcard._(_0);
});
//// [11.ts]
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
    Object.defineProperty(exports, "default", {
        enumerable: true,
        get: function() {
            return _default;
        }
    });
    _0 = /*#__PURE__*/ _interop_require_wildcard._(_0);
    var _default = _0;
});
//// [2.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_interop_require_default",
    "./1",
    "./11"
], function(require, exports, _interop_require_default, _1, _11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _1 = /*#__PURE__*/ _interop_require_default._(_1);
    _11 = /*#__PURE__*/ _interop_require_default._(_11);
    _1.default.a;
    _11.default.a;
    _1.default.b;
    _11.default.b;
});
