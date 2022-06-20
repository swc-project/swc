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
    default: function() {
        return Foo;
    }
});
var _interopRequireDefaultMjs = require("@swc/helpers/lib/_interop_require_default.js");
var _react = (0, _interopRequireDefaultMjs.default)(require("react"));
function Foo() {
    return /*#__PURE__*/ _react.default.createElement("div", {
        onClick: async (e)=>{
            await doSomething();
        }
    });
}
Foo.displayName = "Foo";
