//// [exportAndImport-es5-amd.ts]
define([
    "require"
], function(require) {});
//// [m1.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    function f1() {}
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "default", {
        enumerable: !0,
        get: function() {
            return f1;
        }
    });
});
//// [m2.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_interop_require_default",
    "./m1"
], function(require, exports, _interop_require_default, _m1) {
    "use strict";
    function f2() {
        (0, _m1.default)();
    }
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "default", {
        enumerable: !0,
        get: function() {
            return f2;
        }
    }), _m1 = _interop_require_default._(_m1);
});
