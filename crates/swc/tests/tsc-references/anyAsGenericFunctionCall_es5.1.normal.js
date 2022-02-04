function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// any is considered an untyped function call
// can be called except with type arguments which is an error
var x;
var a = x();
var b = x('hello');
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
};
var c = x(x);
var d = x(x);
