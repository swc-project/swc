function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: a.js
function Outer() {
    this.y = 2;
}
Outer.Inner = function I() {
    "use strict";
    _classCallCheck(this, I);
    this.x = 1;
};
/** @type {Outer} */ var ok;
ok.y;
/** @type {Outer.Inner} */ var oc;
oc.x;
