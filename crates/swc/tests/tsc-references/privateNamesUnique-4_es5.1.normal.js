function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var A1 = function A1() {
    "use strict";
    _classCallCheck(this, A1);
};
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
    _something.set(this, {
        writable: true,
        value: void 0
    });
};
var _something = new WeakMap();
var c = a;
