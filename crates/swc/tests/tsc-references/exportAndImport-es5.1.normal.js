//// [exportAndImport-es5.ts]
"use strict";
//// [m1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return f1;
    }
});
function f1() {}
//// [m2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return f2;
    }
});
var _interopRequireDefault = require("@swc/helpers/lib/_interop_require_default.js").default;
var _m1 = /*#__PURE__*/ _interopRequireDefault(require("./m1"));
function f2() {
    (0, _m1.default)();
}
