function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var A = function A() {
    "use strict";
    _classCallCheck(this, A);
};
A.bar = A.foo + 1;
var __ = {
    writable: true,
    value: function() {
        A.foo + 2;
    }()
};
A.foo = 1;
