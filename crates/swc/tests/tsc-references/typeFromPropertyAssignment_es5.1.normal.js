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
    swcHelpers.createClass(O, [
        {
            key: "m",
            value: function m(x, y) {}
        }
    ]);
    return O;
}();
Outer.Inner = /*#__PURE__*/ (function() {
    "use strict";
    function I() {
        swcHelpers.classCallCheck(this, I);
    }
    swcHelpers.createClass(I, [
        {
            key: "n",
            value: function n(a, b) {}
        }
    ]);
    return I;
})();
/** @type {Outer} */ var si;
si.m;
/** @type {Outer.Inner} */ var oi;
oi.n;
