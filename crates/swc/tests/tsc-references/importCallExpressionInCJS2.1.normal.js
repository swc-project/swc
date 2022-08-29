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
Object.defineProperty(exports, "backup", {
    enumerable: true,
    get: ()=>backup
});
function backup() {
    return "backup";
}
//// [2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
async function compute(promise) {
    let j = await promise;
    if (!j) {
        j = await Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./1")));
        return j.backup();
    }
    return j.foo();
}
compute(Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./0"))));
