//// [importCallExpressionCheckReturntype1.ts]
"use strict";
//// [anotherModule.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "D", {
    enumerable: !0,
    get: ()=>D
});
class D {
}
//// [defaultPath.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "C", {
    enumerable: !0,
    get: ()=>C
});
class C {
}
//// [1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
Promise.resolve().then(()=>_interopRequireWildcard(require("./defaultPath"))), Promise.resolve().then(()=>_interopRequireWildcard(require("./defaultPath"))), Promise.resolve().then(()=>_interopRequireWildcard(require("./defaultPath")));
