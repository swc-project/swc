//// [exportsAndImports4-es6.ts]
"use strict";
//// [t1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: ()=>_default
});
const _default = "hello";
//// [t2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default, _t1 = _interopRequireWildcard(require("./t1")), a = require("./t1");
a.default, _t1.default, _t1.default, _t1.default, _t1.default, _t1.default, _t1.default, _t1.default;
//// [t3.ts]
"use strict";
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), _export(exports, {
    a: ()=>a,
    b: ()=>_t1.default,
    c: ()=>_t1,
    d: ()=>_t1.default,
    e1: ()=>_t1.default,
    e2: ()=>_t1,
    f1: ()=>_t1.default,
    f2: ()=>_t1.default
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default, _t1 = _interopRequireWildcard(require("./t1")), a = require("./t1");
a.default, _t1.default, _t1.default, _t1.default, _t1.default, _t1.default, _t1.default, _t1.default;
