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
Object.defineProperty(exports, "ns", {
    enumerable: true,
    get: function() {
        return _0;
    }
});
var _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var _0 = /*#__PURE__*/ _interopRequireWildcard(require("./0"));
ns.a;
ns.b;
//// [2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var _1 = /*#__PURE__*/ _interopRequireWildcard(require("./1"));
_1.ns.a;
_1.ns.b;
