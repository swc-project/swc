function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var A;
(function(A) {
    var Point = function Point(x, y) {
        "use strict";
        _classCallCheck(this, Point);
        this.x = x;
        this.y = y;
    };
    A.Point = Point;
    A.Origin = new Point(0, 0);
})(A || (A = {
}));
// no code gen expected
var C;
(function(C) {
    var m;
    var p;
    var p = {
        x: 0,
        y: 0
    };
})(C || (C = {
}));
// code gen expected
var D;
(function(D) {
    var a = A;
    var p = new a.Point(1, 1);
})(D || (D = {
}));
var E;
(function(E) {
    var xDist = function xDist(x) {
        return a.Origin.x - x.x;
    };
    var a = A;
    E.xDist = xDist;
})(E || (E = {
}));
