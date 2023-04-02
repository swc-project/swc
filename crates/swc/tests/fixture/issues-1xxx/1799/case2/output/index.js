"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>Foo
});
const _async_to_generator = require("@swc/helpers/lib/_async_to_generator.js").default;
const _interop_require_default = require("@swc/helpers/lib/_interop_require_default.js").default;
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
function Foo() {
    return /*#__PURE__*/ _react.default.createElement("div", {
        onClick: /*#__PURE__*/ _async_to_generator(function*(e) {
            yield doSomething();
        })
    });
}
Foo.displayName = "Foo";
