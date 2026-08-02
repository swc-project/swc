//// [defaultExportsCannotMerge01.ts]
"use strict";
//// [m1.ts]
"use strict";
var Decl;
function Decl1() {
    return 0;
}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return Decl1;
    }
}), (Decl = Decl1 || (Decl1 = {})).x = 10, Decl.y = 20;
//// [m2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _m1 = /*#__PURE__*/ require("@swc/helpers/_/_interop_require_default")._(require("m1"));
(0, _m1.default)(), _m1.default.x, _m1.default.y;
