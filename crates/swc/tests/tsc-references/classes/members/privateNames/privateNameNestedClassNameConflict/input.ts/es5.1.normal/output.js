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
        value: void 0
    });
    var A1 = function A1() {
        _classCallCheck(this, A1);
        _foo1.set(this, {
            writable: true,
            value: void 0
        });
    };
    var _foo1 = new WeakMap();
};
var _foo = new WeakMap();
