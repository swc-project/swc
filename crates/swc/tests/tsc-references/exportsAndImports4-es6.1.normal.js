//// [exportsAndImports4-es6.ts]
"use strict";
//// [t1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>_default
});
const _default = "hello";
//// [t2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
const _t1 = /*#__PURE__*/ _interopRequireWildcard(require("./t1"));
const a = require("./t1");
a.default;
_t1.default;
_t1.default;
_t1.default;
_t1.default;
_t1.default;
_t1.default;
_t1.default;
//// [t3.ts]
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
    a: ()=>a,
    b: ()=>_t1.default,
    c: ()=>_t1,
    d: ()=>_t1.default,
    e1: ()=>_t1.default,
    e2: ()=>_t1,
    f1: ()=>_t1.default,
    f2: ()=>_t1.default
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
const _t1 = /*#__PURE__*/ _interopRequireWildcard(require("./t1"));
const a = require("./t1");
a.default;
_t1.default;
_t1.default;
_t1.default;
_t1.default;
_t1.default;
_t1.default;
_t1.default;
