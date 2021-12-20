function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var A = function A() {
    "use strict";
    _classCallCheck(this, A);
    _field.set(this, {
        writable: true,
        value: 10
    });
    _uninitialized.set(this, {
        writable: true,
        value: void 0
    });
};
var _field = new WeakMap();
var _uninitialized = new WeakMap();
