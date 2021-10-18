function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
};
var x1;
var x2;
var a;
var b;
var c;
var d;
var r1 = _instanceof(a, x1);
var r2 = _instanceof(b, x2);
var r3 = _instanceof(c, x1);
var r4 = _instanceof(d, x1);
