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
// We use Promise<any> for now as there is no way to specify shape of module object
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
function foo(x) {
    x.then((value)=>{
        let b = new value.B();
        b.print();
    });
}
foo(Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./0"))));
