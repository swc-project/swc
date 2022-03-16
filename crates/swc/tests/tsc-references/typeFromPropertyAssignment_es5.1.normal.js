import * as swcHelpers from "@swc/helpers";
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: a.js
var Outer = /*#__PURE__*/ function() {
    "use strict";
    function O() {
        swcHelpers.classCallCheck(this, O);
    }
    var _proto = O.prototype;
    _proto.m = function m(x, y) {};
    return O;
}();
Outer.Inner = /*#__PURE__*/ function() {
    "use strict";
    function I() {
        swcHelpers.classCallCheck(this, I);
    }
    var _proto = I.prototype;
    _proto.n = function n(a, b) {};
    return I;
}();
/** @type {Outer} */ var si;
si.m;
/** @type {Outer.Inner} */ var oi;
oi.n;
