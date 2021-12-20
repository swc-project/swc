function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
};
var a;
var b = {
    foo: null
};
// These should all be of type 'any'
var r1 = new C().foo;
var r2 = null.foo;
var r3 = a.foo;
var r4 = b.foo;
