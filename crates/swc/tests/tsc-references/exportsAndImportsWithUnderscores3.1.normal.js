//// [exportsAndImportsWithUnderscores3.ts]
"use strict";
//// [m1.ts]
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
var R;
var _default = R = {
    ___: 30,
    ___hello: 21,
    _hi: 40
};
//// [m2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _interopRequireDefault = require("@swc/helpers/lib/_interop_require_default.js").default;
var _m1 = /*#__PURE__*/ _interopRequireDefault(require("./m1"));
var ___ = _m1.default.___, ___hello = _m1.default.___hello, _hi = _m1.default._hi;
