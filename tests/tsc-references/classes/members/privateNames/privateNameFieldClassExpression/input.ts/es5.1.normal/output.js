function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var _class2, _class1;
var B = function B() {
    "use strict";
    _classCallCheck(this, B);
    _foo.set(this, {
        writable: true,
        value: (_class2 = function _class() {
            _classCallCheck(this, _class);
            console.log("hello");
        }, _class2.test = 123, _class2)
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
