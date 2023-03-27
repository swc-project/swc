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
    "@swc/helpers/src/_interop_require_default.mjs",
    "./m1"
], function(require, exports, _interop_require_default, _m_1) {
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
    _interop_require_default = _interop_require_default.default;
    _m_1 = /*#__PURE__*/ _interop_require_default(_m_1);
    function f2() {
        (0, _m_1.default)();
    }
});
