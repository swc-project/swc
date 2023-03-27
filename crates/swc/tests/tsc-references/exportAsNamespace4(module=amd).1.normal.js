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
    _interop_require_wildcard = _interop_require_wildcard.default;
    _0 = /*#__PURE__*/ _interop_require_wildcard(_0);
});
//// [11.ts]
define([
    "require",
    "exports",
    "@swc/helpers/src/_interop_require_wildcard.mjs",
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
    _interop_require_wildcard = _interop_require_wildcard.default;
    _0 = /*#__PURE__*/ _interop_require_wildcard(_0);
    var _default = _0;
});
//// [2.ts]
define([
    "require",
    "exports",
    "@swc/helpers/src/_interop_require_default.mjs",
    "./1",
    "./11"
], function(require, exports, _interop_require_default, _1, _11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _interop_require_default = _interop_require_default.default;
    _1 = /*#__PURE__*/ _interop_require_default(_1);
    _11 = /*#__PURE__*/ _interop_require_default(_11);
    _1.default.a;
    _11.default.a;
    _1.default.b;
    _11.default.b;
});
