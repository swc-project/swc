//// [exportsAndImportsWithUnderscores2.ts]
"use strict";
//// [m1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return _default;
    }
});
var R, _default = R = {
    __esmodule: !0,
    __proto__: {}
};
//// [m2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _interopRequireDefault = require("@swc/helpers/lib/_interop_require_default.js").default, _m1 = _interopRequireDefault(require("./m1")), __esmodule = _m1.default.__esmodule, __proto__ = _m1.default.__proto__;
