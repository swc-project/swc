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
// We use Promise<any> for now as there is no way to specify shape of module object
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
function foo(x) {
    x.then((value)=>{
        let b = new value.B();
        b.print();
    });
}
foo(Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./0"))));
