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
        value: 1
    });
    _prop.set(this, {
        writable: true,
        value: 2
    });
};
var _foo = new WeakMap();
var _prop = new WeakMap();
A.inst = new A();
