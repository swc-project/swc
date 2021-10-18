function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var G = function G() {
    "use strict";
    _classCallCheck(this, G);
};
var Foo = function Foo() {
    "use strict";
    _classCallCheck(this, Foo);
};
var D = function D() {
    "use strict";
    _classCallCheck(this, D);
};
var c1 = new Foo(); // ok, circularity in assignment compat check causes success
