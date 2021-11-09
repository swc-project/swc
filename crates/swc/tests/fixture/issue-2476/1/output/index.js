function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var Foo = function Foo() {
    "use strict";
    _classCallCheck(this, Foo);
};
var __ = {
    writable: true,
    value: function() {
        Foo.bar = "3";
    }()
};
console.log(Foo.bar);
console.log(new Foo().bar);
