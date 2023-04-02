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
const _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
!function(x) {
    x.then((value)=>{
        new value.B().print();
    });
}(Promise.resolve().then(()=>_interop_require_wildcard(require("./0"))));
