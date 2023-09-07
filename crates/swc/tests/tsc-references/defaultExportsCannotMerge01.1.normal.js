//// [defaultExportsCannotMerge01.ts]
"use strict";
//// [m1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return Decl;
    }
});
function Decl() {
    return 0;
}
(function(Decl) {
    var x = 10;
    Object.defineProperty(Decl, "x", {
        enumerable: true,
        get: function get() {
            return x;
        },
        set: function set(v) {
            x = v;
        }
    });
    var y = 20;
    Object.defineProperty(Decl, "y", {
        enumerable: true,
        get: function get() {
            return y;
        },
        set: function set(v) {
            y = v;
        }
    });
})(Decl || (Decl = {}));
//// [m2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _interop_require_default = require("@swc/helpers/_/_interop_require_default");
var _m1 = /*#__PURE__*/ _interop_require_default._(require("m1"));
(0, _m1.default)();
var x;
var y;
_m1.default.x;
_m1.default.y;
