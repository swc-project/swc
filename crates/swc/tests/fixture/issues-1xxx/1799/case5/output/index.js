"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    get: ()=>Foo,
    enumerable: true
});
var _interopRequireDefaultMjs = require("@swc/helpers/lib/_interop_require_default.js").default;
var _react = _interopRequireDefaultMjs(require("react"));
function Foo() {
    return call(async (e)=>{
        await doSomething();
    });
}
Foo.displayName = "Foo";
