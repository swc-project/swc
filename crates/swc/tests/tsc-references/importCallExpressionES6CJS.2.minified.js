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
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), _export(exports, {
    p2: ()=>p2,
    D: ()=>D
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
Promise.resolve().then(()=>_interopRequireWildcard(require("./0")));
var p1 = Promise.resolve().then(()=>_interopRequireWildcard(require("./0")));
p1.then((zero)=>zero.foo());
var p2 = Promise.resolve().then(()=>_interopRequireWildcard(require("./0")));
function foo() {
    Promise.resolve().then(()=>_interopRequireWildcard(require("./0")));
}
class C {
    method() {
        Promise.resolve().then(()=>_interopRequireWildcard(require("./0")));
    }
}
class D {
    method() {
        Promise.resolve().then(()=>_interopRequireWildcard(require("./0")));
    }
}
