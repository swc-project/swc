"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    get: ()=>Foo,
    enumerable: true
});
var _asyncToGeneratorMjs = require("@swc/helpers/lib/_async_to_generator.js").default;
var _interopRequireDefaultMjs = require("@swc/helpers/lib/_interop_require_default.js").default;
var _react = _interopRequireDefaultMjs(require("react"));
function Foo() {
    return /*#__PURE__*/ _react.default.createElement("div", {
        onClick: _asyncToGeneratorMjs(function*(e) {
            yield doSomething();
        })
    });
}
Foo.displayName = "Foo";
