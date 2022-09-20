//// [exportAndImport-es3-amd.ts]
define([
    "require"
], function(require) {});
//// [m1.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    Object.defineProperty(exports, "default", {
        enumerable: !0,
        get: function() {
            return f1;
        }
    });
    function f1() {}
});
//// [m2.ts]
define([
    "require",
    "exports",
    "@swc/helpers/src/_interop_require_default.mjs",
    "./m1"
], function(require, exports, _interopRequireDefault, _m1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    Object.defineProperty(exports, "default", {
        enumerable: !0,
        get: function() {
            return f2;
        }
    });
    _m1 = (_interopRequireDefault = _interopRequireDefault.default)(_m1);
    function f2() {
        (0, _m1.default)();
    }
});
