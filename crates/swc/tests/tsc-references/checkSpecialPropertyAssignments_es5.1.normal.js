import * as swcHelpers from "@swc/helpers";
// @noEmit: true
// @checkJs: true
// @allowJs: true
// @Filename: bug24252.js
var A = {};
A.B = /*#__PURE__*/ function() {
    "use strict";
    function _class() {
        swcHelpers.classCallCheck(this, _class);
    }
    var _proto = _class.prototype;
    _proto.m = function m() {
        /** @type {string[]} */ var x = [];
        /** @type {number[]} */ var y;
        y = x;
    };
    return _class;
}();
