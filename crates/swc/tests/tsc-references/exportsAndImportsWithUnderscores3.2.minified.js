//// [exportsAndImportsWithUnderscores3.ts]
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
    ___: 30,
    ___hello: 21,
    _hi: 40
};
//// [m2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _interopRequireDefault = require("@swc/helpers/lib/_interop_require_default.js").default, _m1 = _interopRequireDefault(require("./m1")), ___ = _m1.default.___, ___hello = _m1.default.___hello, _hi = _m1.default._hi;
