import * as swcHelpers from "@swc/helpers";
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: a.js
var Outer = function O() {
    this.y = 2;
};
Outer.Inner = function I() {
    "use strict";
    swcHelpers.classCallCheck(this, I);
    this.x = 1;
};
/** @type {Outer} */ var ja;
ja.y;
/** @type {Outer.Inner} */ var da;
da.x;
