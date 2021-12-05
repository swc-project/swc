function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var _class, _class1;
var B = function B() {
    "use strict";
    _classCallCheck(this, B);
    _foo.set(this, {
        writable: true,
        value: (_class = function _class2() {
            _classCallCheck(this, _class2);
            console.log("hello");
        }, _class.test = 123, _class)
    });
    _foo2.set(this, {
        writable: true,
        value: (_class1 = function Foo() {
            _classCallCheck(this, Foo);
        }, _class1.otherClass = 123, _class1)
    });
};
var _foo = new WeakMap();
var _foo2 = new WeakMap();
