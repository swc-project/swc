function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @target: esnext, es2022
var a = 1;
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
};
C.f1 = 1;
var __ = {
    writable: true,
    value: function() {
        console.log(C.f1, C.f2, C.f3);
    }()
};
C.f2 = 2;
var __1 = {
    writable: true,
    value: function() {
        console.log(C.f1, C.f2, C.f3);
    }()
};
C.f3 = 3;
