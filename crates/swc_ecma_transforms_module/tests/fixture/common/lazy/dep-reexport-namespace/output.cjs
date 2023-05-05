"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "namespace", {
    enumerable: true,
    get: function() {
        return _foo();
    }
});
function _foo() {
    const data = /*#__PURE__*/ _interop_require_wildcard(require("foo"));
    _foo = function() {
        return data;
    };
    return data;
}
