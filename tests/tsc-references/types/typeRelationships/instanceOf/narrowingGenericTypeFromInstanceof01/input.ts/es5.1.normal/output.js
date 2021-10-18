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
var A = function A(a) {
    "use strict";
    _classCallCheck(this, A);
    this.a = a;
};
var B = function B() {
    "use strict";
    _classCallCheck(this, B);
};
function acceptA(a) {
}
function acceptB(b) {
}
function test(x) {
    if (_instanceof(x, B)) {
        acceptA(x);
    }
    if (_instanceof(x, A)) {
        acceptA(x);
    }
    if (_instanceof(x, B)) {
        acceptB(x);
    }
    if (_instanceof(x, B)) {
        acceptB(x);
    }
}
