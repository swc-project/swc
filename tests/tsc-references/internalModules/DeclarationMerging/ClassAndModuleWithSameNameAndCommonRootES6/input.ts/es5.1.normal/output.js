function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @filename: test.ts
//var cl: { x: number; y: number; }
var cl = new X.Y.Point(1, 1);
var cl = X.Y.Point.Origin; // error not expected here same as bug 83996 ?
var A = function A() {
    "use strict";
    _classCallCheck(this, A);
};
(function(A1) {
    A1.Instance = new A();
})(A || (A = {
}));
// ensure merging works as expected
var a = A.Instance;
var a = new A();
var a;
