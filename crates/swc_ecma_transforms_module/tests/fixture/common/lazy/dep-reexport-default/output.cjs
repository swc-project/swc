"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _foo().default;
    }
});
function _foo() {
    const data = /*#__PURE__*/ _interop_require_default(require("foo"));
    _foo = function() {
        return data;
    };
    return data;
}
