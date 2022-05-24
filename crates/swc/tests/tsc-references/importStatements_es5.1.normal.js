import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var A;
(function(A1) {
    var Point = function Point(x, y) {
        "use strict";
        _class_call_check(this, Point);
        this.x = x;
        this.y = y;
    };
    A1.Point = Point;
    var Origin = A1.Origin = new Point(0, 0);
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
(function(E1) {
    var xDist = function xDist(x) {
        return a.Origin.x - x.x;
    };
    var a = A;
    E1.xDist = xDist;
})(E || (E = {}));
