//// [0.ts]
"use strict";
function foo() {
    return "foo";
}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "foo", {
    enumerable: !0,
    get: ()=>foo
});
//// [1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    p2: ()=>p2,
    D: ()=>D
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
Promise.resolve().then(()=>_interopRequireWildcard(require("./0"))), Promise.resolve().then(()=>_interopRequireWildcard(require("./0"))).then((zero)=>zero.foo());
var p2 = Promise.resolve().then(()=>_interopRequireWildcard(require("./0")));
class D {
    method() {
        Promise.resolve().then(()=>_interopRequireWildcard(require("./0")));
    }
}
