"use strict";
function _foo() {
    var data = _interopRequireWildcard(require("foo"));
    _foo = function() {
        return data;
    };
    return data;
}
function use() {
    console.log(_foo());
}
