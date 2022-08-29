//// [importAssertion2.ts]
"use strict";
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
    a: ()=>a,
    b: ()=>b
});
const a = 1;
const b = 2;
//// [1.ts]
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
    a: ()=>_0.a,
    b: ()=>_0.b,
    ns: ()=>_0
});
const _exportStar = require("@swc/helpers/lib/_export_star.js").default;
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
const _0 = /*#__PURE__*/ _interopRequireWildcard(_exportStar(require("./0"), exports));
//// [2.ts]
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
    a: ()=>_0.a,
    b: ()=>_0.b,
    c: ()=>_0.a,
    d: ()=>_0.b
});
const _0 = require("./0");
