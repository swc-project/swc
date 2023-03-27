//// [exportsAndImports4-amd.ts]
define([
    "require"
], function(require) {
    "use strict";
});
//// [t1.ts]
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
            return _default;
        }
    });
    var _default = "hello";
});
//// [t2.ts]
define([
    "require",
    "exports",
    "@swc/helpers/src/_interop_require_wildcard.mjs",
    "./t1"
], function(require, exports, _interop_require_wildcard, _t_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _interop_require_wildcard = _interop_require_wildcard.default;
    var _t_11 = /*#__PURE__*/ _interop_require_wildcard(_t_1);
    _t_1.default;
    _t_11.default;
    _t_11.default;
    _t_11.default;
    _t_11.default;
    _t_11.default;
    _t_11.default;
    _t_11.default;
});
//// [t3.ts]
define([
    "require",
    "exports",
    "@swc/helpers/src/_interop_require_wildcard.mjs",
    "./t1"
], function(require, exports, _interop_require_wildcard, _t_1) {
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
            return _t_1;
        },
        b: function() {
            return _t_11.default;
        },
        c: function() {
            return _t_11;
        },
        d: function() {
            return _t_11.default;
        },
        e1: function() {
            return _t_11.default;
        },
        e2: function() {
            return _t_11;
        },
        f1: function() {
            return _t_11.default;
        },
        f2: function() {
            return _t_11.default;
        }
    });
    _interop_require_wildcard = _interop_require_wildcard.default;
    var _t_11 = /*#__PURE__*/ _interop_require_wildcard(_t_1);
    _t_1.default;
    _t_11.default;
    _t_11.default;
    _t_11.default;
    _t_11.default;
    _t_11.default;
    _t_11.default;
    _t_11.default;
});
