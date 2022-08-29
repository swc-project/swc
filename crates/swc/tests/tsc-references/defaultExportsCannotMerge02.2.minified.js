//// [defaultExportsCannotMerge02.ts]
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
var _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default, Decl = function Decl() {
    "use strict";
    _classCallCheck(this, Decl);
};
//// [m2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _m1 = (0, require("@swc/helpers/lib/_interop_require_default.js").default)(require("m1"));
(0, _m1.default)();
var z = new _m1.default();
z.p1, z.p2;
