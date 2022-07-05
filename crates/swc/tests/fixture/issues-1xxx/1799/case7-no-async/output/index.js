"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return Foo;
    }
});
var _interopRequireDefault = require("@swc/helpers/lib/_interop_require_default.js").default;
var _react = /*#__PURE__*/ _interopRequireDefault(require("react"));
function Foo() {
    return call(function(e) {
        doSomething();
    });
}
Foo.displayName = "Foo";
