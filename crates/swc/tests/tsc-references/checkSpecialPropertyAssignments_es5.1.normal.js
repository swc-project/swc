import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @noEmit: true
// @checkJs: true
// @allowJs: true
// @Filename: bug24252.js
var A = {};
A.B = /*#__PURE__*/ function() {
    "use strict";
    function _class() {
        _class_call_check(this, _class);
    }
    var _proto = _class.prototype;
    _proto.m = function m() {
        /** @type {string[]} */ var x = [];
        /** @type {number[]} */ var y;
        y = x;
    };
    return _class;
}();
