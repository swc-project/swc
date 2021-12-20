function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
};
var c = new C();
function Foo() {
}
var r = new Foo();
var f;
var r2 = new f();
var a;
// BUG 790977
var r2 = new a();
