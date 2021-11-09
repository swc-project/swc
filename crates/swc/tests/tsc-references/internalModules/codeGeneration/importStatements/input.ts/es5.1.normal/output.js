function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var A1;
(function(A) {
    var Point = function Point(x, y) {
        "use strict";
        _classCallCheck(this, Point);
        this.x = x;
        this.y = y;
    };
    A.Point = Point;
    A.Origin = new Point(0, 0);
})(A1 || (A1 = {
}));
// no code gen expected
var B;
(function(B) {
    var a = A1;
})(B || (B = {
}));
// no code gen expected
var C;
(function(C) {
    var a = A1;
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
    var a = A1;
    var p = new a.Point(1, 1);
})(D || (D = {
}));
var E1;
(function(E) {
    var xDist = function xDist(x) {
        return a.Origin.x - x.x;
    };
    var a = A1;
    E.xDist = xDist;
})(E1 || (E1 = {
}));
