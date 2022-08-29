//// [0.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "B", {
    enumerable: true,
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
    value: true
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
async function foo() {
    class C extends (await Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./0")))).B {
    }
    var c = new C();
    c.print();
}
foo();
