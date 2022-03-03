function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var C = function C(foo) {
    "use strict";
    _classCallCheck(this, C);
    this.foo = foo;
};
C.create = function() {
    return new C("yep");
};
