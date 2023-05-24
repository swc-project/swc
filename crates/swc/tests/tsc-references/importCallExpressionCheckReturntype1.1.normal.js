//// [importCallExpressionCheckReturntype1.ts]
"use strict";
//// [anotherModule.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "D", {
    enumerable: true,
    get: function() {
        return D;
    }
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
    get: function() {
        return C;
    }
});
class C {
}
//// [1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
let p1 = Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./defaultPath")));
let p2 = Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./defaultPath")));
let p3 = Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./defaultPath")));
