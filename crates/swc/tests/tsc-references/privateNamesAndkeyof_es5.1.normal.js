function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var A = function A() {
    "use strict";
    _classCallCheck(this, A);
    _foo.set(this, {
        writable: true,
        value: 3
    });
    // @strict: true
    // @target: es6
    this.bar = 3;
    this.baz = 3;
};
var _foo = new WeakMap();
