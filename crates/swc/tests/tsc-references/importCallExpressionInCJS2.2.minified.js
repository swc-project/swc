//// [0.ts]
function foo() {
    return "foo";
}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "foo", {
    enumerable: !0,
    get: function() {
        return foo;
    }
});
//// [1.ts]
function backup() {
    return "backup";
}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "backup", {
    enumerable: !0,
    get: function() {
        return backup;
    }
});
//// [2.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
!async function(promise) {
    let j = await promise;
    j ? j.foo() : (j = await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./1")))).backup();
}(Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./0"))));
