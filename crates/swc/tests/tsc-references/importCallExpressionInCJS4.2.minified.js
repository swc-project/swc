//// [0.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "B", {
    enumerable: !0,
    get: ()=>B
});
class B {
    print() {
        return "I am B";
    }
}
//// [2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
async function foo() {
    class C extends (await Promise.resolve().then(()=>_interopRequireWildcard(require("./0")))).B {
    }
    new C().print();
}
foo();
