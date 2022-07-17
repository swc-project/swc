"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>_foo().default
});
function _foo() {
    const data = /*#__PURE__*/ _interopRequireDefault(require("foo"));
    _foo = function() {
        return data;
    };
    return data;
}
