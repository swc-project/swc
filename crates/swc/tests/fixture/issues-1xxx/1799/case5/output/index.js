"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>Foo
});
const _interop_require_default = require("@swc/helpers/lib/_interop_require_default.js").default;
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
function Foo() {
    return call(async (e)=>{
        await doSomething();
    });
}
Foo.displayName = "Foo";
