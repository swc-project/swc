function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
};
var __ = {
    writable: true,
    value: function() {
        C.s1;
        C.s1;
        C.s2;
        C.s2;
    }()
};
C.s1 = 1;
C.s2 = 2;
C.ss2 = C.s1;
