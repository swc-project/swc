import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var A;
(function(A) {
    var Point = function Point(x, y) {
        "use strict";
        _class_call_check(this, Point);
        this.x = x;
        this.y = y;
    };
    A.Point = Point;
    var Origin = A.Origin = new Point(0, 0);
})(A || (A = {}));
// no code gen expected
var C;
(function(C) {
    var m;
    var p;
    var p = {
        x: 0,
        y: 0
    };
})(C || (C = {}));
// code gen expected
var D;
(function(D) {
    var a = A;
    var p = new a.Point(1, 1);
})(D || (D = {}));
var E;
(function(E) {
    var xDist = function xDist(x) {
        return a.Origin.x - x.x;
    };
    var a = A;
    E.xDist = xDist;
})(E || (E = {}));
