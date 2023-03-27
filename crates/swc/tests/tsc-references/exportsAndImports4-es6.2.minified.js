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
const _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default, _t_1 = _interop_require_wildcard(require("./t1")), a = require("./t1");
a.default, _t_1.default, _t_1.default, _t_1.default, _t_1.default, _t_1.default, _t_1.default, _t_1.default;
//// [t3.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    a: ()=>a,
    b: ()=>_t_1.default,
    c: ()=>_t_1,
    d: ()=>_t_1.default,
    e1: ()=>_t_1.default,
    e2: ()=>_t_1,
    f1: ()=>_t_1.default,
    f2: ()=>_t_1.default
});
const _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default, _t_1 = _interop_require_wildcard(require("./t1")), a = require("./t1");
a.default, _t_1.default, _t_1.default, _t_1.default, _t_1.default, _t_1.default, _t_1.default, _t_1.default;
