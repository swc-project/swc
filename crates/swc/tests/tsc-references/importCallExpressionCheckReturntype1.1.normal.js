//// [importCallExpressionCheckReturntype1.ts]
"use strict";
//// [anotherModule.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "D", {
    enumerable: true,
    get: ()=>D
});
class D {
}
//// [defaultPath.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "C", {
    enumerable: true,
    get: ()=>C
});
class C {
}
//// [1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
let p1 = Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./defaultPath")));
let p2 = Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./defaultPath")));
let p3 = Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./defaultPath")));
