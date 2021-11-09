function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
var _class2, _class1, B = function() {
    "use strict";
    _classCallCheck(this, B), _foo.set(this, {
        writable: !0,
        value: ((_class2 = function _class() {
            _classCallCheck(this, _class), console.log("hello");
        }).test = 123, _class2)
    }), _foo2.set(this, {
        writable: !0,
        value: ((_class1 = function Foo() {
            _classCallCheck(this, Foo);
        }).otherClass = 123, _class1)
    });
}, _foo = new WeakMap(), _foo2 = new WeakMap();
