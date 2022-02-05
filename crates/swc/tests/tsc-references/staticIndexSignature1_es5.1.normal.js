function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
};
C["foo"] = 1;
C.bar = 2;
var foo = C["foo"];
C[42] = 42;
C[2] = 2;
var bar = C[42];
