"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function __export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        get: all[name],
        enumerable: true
    });
}
__export(exports, {
    default: ()=>Foo
});
var _interopRequireDefaultMjs = require("@swc/helpers/lib/_interop_require_default.js").default;
var _react = _interopRequireDefaultMjs(require("react"));
function Foo() {
    return call(async (e)=>{
        await doSomething();
    });
}
Foo.displayName = "Foo";
