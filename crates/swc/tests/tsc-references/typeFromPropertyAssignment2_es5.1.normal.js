import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: a.js
function Outer() {
    this.y = 2;
}
Outer.Inner = function I() {
    "use strict";
    _class_call_check(this, I);
    this.x = 1;
};
/** @type {Outer} */ var ok;
ok.y;
/** @type {Outer.Inner} */ var oc;
oc.x;
