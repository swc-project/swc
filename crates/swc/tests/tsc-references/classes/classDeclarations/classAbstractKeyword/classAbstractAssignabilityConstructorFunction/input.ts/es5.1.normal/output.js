function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var A = function A() {
    "use strict";
    _classCallCheck(this, A);
};
// var AA: typeof A;
var AAA;
// AA = A; // okay
AAA = A; // error. 
AAA = "asdf";
