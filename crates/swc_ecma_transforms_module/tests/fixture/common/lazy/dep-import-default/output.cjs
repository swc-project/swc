"use strict";
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
