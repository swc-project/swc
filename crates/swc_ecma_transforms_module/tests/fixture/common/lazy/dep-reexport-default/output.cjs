"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    get: ()=>_foo().default,
    enumerable: true
});
function _foo() {
    var data = _interopRequireDefault(require("foo"));
    _foo = function() {
        return data;
    };
    return data;
}
