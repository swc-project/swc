"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _foo() {
    const data = _interopRequireDefault(require("foo"));
    _foo = function() {
        return data;
    };
    return data;
}
function use() {
    console.log(_foo().default);
}
