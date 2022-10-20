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
function backup() {
    return "backup";
}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "backup", {
    enumerable: !0,
    get: ()=>backup
});
//// [2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
!async function(promise) {
    let j = await promise;
    j ? j.foo() : (j = await Promise.resolve().then(()=>_interopRequireWildcard(require("./1")))).backup();
}(Promise.resolve().then(()=>_interopRequireWildcard(require("./0"))));
