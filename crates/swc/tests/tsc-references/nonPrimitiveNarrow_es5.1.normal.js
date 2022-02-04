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
var Narrow = function Narrow() {
    "use strict";
    _classCallCheck(this, Narrow);
};
var a;
if (_instanceof(a, Narrow)) {
    a.narrowed; // ok
    a = 123; // error
}
if (typeof a === 'number') {
    a.toFixed(); // error, never
}
var b;
if (typeof b === 'object') {
    b.toString(); // ok, object | null
} else {
    b.toString(); // error, never
}
