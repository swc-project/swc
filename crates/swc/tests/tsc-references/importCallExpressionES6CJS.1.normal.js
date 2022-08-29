//// [0.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "foo", {
    enumerable: true,
    get: ()=>foo
});
function foo() {
    return "foo";
}
//// [1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    p2: ()=>p2,
    D: ()=>D
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./0")));
var p1 = Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./0")));
p1.then((zero)=>{
    return zero.foo();
});
var p2 = Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./0")));
function foo() {
    const p2 = Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./0")));
}
class C {
    method() {
        const loadAsync = Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./0")));
    }
}
class D {
    method() {
        const loadAsync = Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./0")));
    }
}
