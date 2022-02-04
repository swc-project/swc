function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
var _class, _class1, B = function() {
    "use strict";
    _classCallCheck(this, B), _foo.set(this, {
        writable: !0,
        value: ((_class = function _class2() {
            _classCallCheck(this, _class2), console.log("hello");
        }).test = 123, _class)
    }), _foo2.set(this, {
        writable: !0,
        value: ((_class1 = function Foo() {
            _classCallCheck(this, Foo);
        }).otherClass = 123, _class1)
    });
}, _foo = new WeakMap(), _foo2 = new WeakMap();
