//// [0.ts]
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
    a: function() {
        return a;
    },
    b: function() {
        return b;
    }
});
var a = 1;
var b = 2;
//// [1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _0;
    }
});
var _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var _0 = /*#__PURE__*/ _interopRequireWildcard(require("./0"));
//// [11.ts]
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
var _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var _0 = /*#__PURE__*/ _interopRequireWildcard(require("./0"));
var _default = _0;
//// [2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _interopRequireDefault = require("@swc/helpers/lib/_interop_require_default.js").default;
var _1 = /*#__PURE__*/ _interopRequireDefault(require("./1"));
var _11 = /*#__PURE__*/ _interopRequireDefault(require("./11"));
_1.default.a;
_11.default.a;
_1.default.b;
_11.default.b;
