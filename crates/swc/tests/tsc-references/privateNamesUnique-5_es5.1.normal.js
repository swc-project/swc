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
};
var _foo = new WeakMap();
var B = function B() {
    "use strict";
    _classCallCheck(this, B);
    _foo1.set(this, {
        writable: true,
        value: void 0
    });
};
var _foo1 = new WeakMap();
var b = new B();
