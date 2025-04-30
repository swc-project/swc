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
    "@swc/helpers/_/_interop_require_wildcard",
    "./t1"
], function(require, exports, _interop_require_wildcard, _t1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var _t11 = /*#__PURE__*/ _interop_require_wildcard._(_t1);
    _t1.default;
    _t11.default;
    _t11.default;
    _t11.default;
    _t11.default;
    _t11.default;
    _t11.default;
    _t11.default;
});
//// [t3.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_interop_require_wildcard",
    "./t1"
], function(require, exports, _interop_require_wildcard, _t1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: Object.getOwnPropertyDescriptor(all, name).get
        });
    }
    _export(exports, {
        get a () {
            return _t1;
        },
        get b () {
            return _t11.default;
        },
        get c () {
            return _t11;
        },
        get d () {
            return _t11.default;
        },
        get e1 () {
            return _t11.default;
        },
        get e2 () {
            return _t11;
        },
        get f1 () {
            return _t11.default;
        },
        get f2 () {
            return _t11.default;
        }
    });
    var _t11 = /*#__PURE__*/ _interop_require_wildcard._(_t1);
    _t1.default;
    _t11.default;
    _t11.default;
    _t11.default;
    _t11.default;
    _t11.default;
    _t11.default;
    _t11.default;
});
