function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// These are all errors because type parameters cannot reference other type parameters from the same list
function foo(x, y) {
    foo(y, y);
    return new C();
}
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
};
