//// [exportAndImport-es3-amd.ts]
define([
    "require"
], function(require) {
    "use strict";
});
//// [m1.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "default", {
        enumerable: true,
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
    "@swc/helpers/_/_interop_require_default",
    "./m1"
], function(require, exports, _interop_require_default, _m1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "default", {
        enumerable: true,
        get: function() {
            return f2;
        }
    });
    _m1 = /*#__PURE__*/ _interop_require_default._(_m1);
    function f2() {
        (0, _m1.default)();
    }
});
