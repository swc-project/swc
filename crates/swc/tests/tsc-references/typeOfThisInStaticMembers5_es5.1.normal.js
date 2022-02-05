function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var _this = this;
var C = function C(foo) {
    "use strict";
    _classCallCheck(this, C);
    this.foo = foo;
};
C.create = function() {
    return new _this("yep");
};
