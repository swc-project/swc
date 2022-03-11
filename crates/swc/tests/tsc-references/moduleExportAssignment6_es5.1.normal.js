import * as swcHelpers from "@swc/helpers";
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: webpackLibNormalModule.js
var C = /*#__PURE__*/ function() {
    "use strict";
    function C(x) {
        swcHelpers.classCallCheck(this, C);
        this.x = x;
        this.exports = [
            x
        ];
    }
    var _proto = C.prototype;
    /** @param {number} y */ _proto.m = function m(y) {
        return this.x + y;
    };
    return C;
}();
function exec() {
    var module = new C(12);
    return module.exports; // should be fine because `module` is defined locally
}
function tricky() {
    // (a trickier variant of what webpack does)
    var module = new C(12);
    return function() {
        return module.exports;
    };
}
