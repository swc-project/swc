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
function f1(v) {
    if (_instanceof(v, C)) {
        var x = v;
    } else {
        var s = v;
    }
}
var D = function D() {
    "use strict";
    _classCallCheck(this, D);
};
function f2(v) {
    if (_instanceof(v, C)) {
        var x = v;
    } else {
        var y = v;
    }
}
var E = function E() {
    "use strict";
    _classCallCheck(this, E);
};
function f3(v) {
    if (_instanceof(v, E)) {
        var x = v;
    } else {
        var y = v;
    }
}
