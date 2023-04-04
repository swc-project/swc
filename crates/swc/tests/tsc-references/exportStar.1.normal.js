//// [exportStar.ts]
"use strict";
//// [t1.ts]
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
//// [t2.ts]
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
//// [t3.ts]
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
//// [t4.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _export_star = require("@swc/helpers/_/_export_star");
_export_star._(require("./t1"), exports);
_export_star._(require("./t2"), exports);
_export_star._(require("./t3"), exports);
//// [main.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
var _t4 = /*#__PURE__*/ _interop_require_wildcard._(require("./t4"));
_t4.default;
_t4.x;
_t4.y;
_t4.z;
_t4.foo;
