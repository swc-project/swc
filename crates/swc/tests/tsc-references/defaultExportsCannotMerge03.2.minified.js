//// [defaultExportsCannotMerge03.ts]
"use strict";
//// [m1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return Decl;
    }
});
var _class_call_check = require("@swc/helpers/_/_class_call_check"), Decl = function Decl() {
    "use strict";
    _class_call_check._(this, Decl);
};
//// [m2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _m1 = require("@swc/helpers/_/_interop_require_default")._(require("m1"));
(0, _m1.default)();
var z = new _m1.default();
z.p1, z.p2;
