import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: a.js
var Outer = function O() {
    this.y = 2;
};
Outer.Inner = function I() {
    "use strict";
    _class_call_check(this, I);
    this.x = 1;
};
/** @type {Outer} */ var ja;
ja.y;
/** @type {Outer.Inner} */ var da;
da.x;
