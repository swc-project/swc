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
var _default = {
    ___: 30,
    ___hello: 21,
    _hi: 40
};
//// [m2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _m1 = (0, require("@swc/helpers/lib/_interop_require_default.js").default)(require("./m1"));
_m1.default.___, _m1.default.___hello, _m1.default._hi;
