//// [0.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "B", {
    enumerable: true,
    get: function() {
        return B;
    }
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
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
async function foo() {
    class C extends (await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./0")))).B {
    }
    var c = new C();
    c.print();
}
foo();
