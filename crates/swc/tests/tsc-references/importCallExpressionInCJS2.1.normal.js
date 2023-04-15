//// [0.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "foo", {
    enumerable: true,
    get: function() {
        return foo;
    }
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
    get: function() {
        return backup;
    }
});
function backup() {
    return "backup";
}
//// [2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
async function compute(promise) {
    let j = await promise;
    if (!j) {
        j = await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./1")));
        return j.backup();
    }
    return j.foo();
}
compute(Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./0"))));
