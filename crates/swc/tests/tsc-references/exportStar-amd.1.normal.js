//// [exportStar-amd.ts]
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
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
        });
    }
    _export(exports, {
        x: function() {
            return x;
        },
        y: function() {
            return y;
        }
    });
    var x = 1;
    var y = 2;
});
//// [t2.ts]
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
        default: function() {
            return _default;
        },
        foo: function() {
            return foo;
        }
    });
    var _default = "hello";
    function foo() {}
});
//// [t3.ts]
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
        x: function() {
            return x;
        },
        y: function() {
            return y;
        },
        z: function() {
            return z;
        }
    });
    var x = "x";
    var y = "y";
    var z = "z";
});
//// [t4.ts]
define([
    "require",
    "exports",
    "@swc/helpers/src/_export_star.mjs",
    "./t1",
    "./t2",
    "./t3"
], function(require, exports, _export_star, _t1, _t2, _t3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _export_star = _export_star.default;
    _export_star(_t1, exports);
    _export_star(_t2, exports);
    _export_star(_t3, exports);
});
//// [main.ts]
define([
    "require",
    "exports",
    "@swc/helpers/src/_interop_require_wildcard.mjs",
    "./t4"
], function(require, exports, _interop_require_wildcard, _t4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _interop_require_wildcard = _interop_require_wildcard.default;
    _t4 = /*#__PURE__*/ _interop_require_wildcard(_t4);
    _t4.default;
    _t4.x;
    _t4.y;
    _t4.z;
    _t4.foo;
});
