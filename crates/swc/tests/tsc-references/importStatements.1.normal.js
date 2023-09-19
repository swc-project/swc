//// [importStatements.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
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
var C;
// no code gen expected
(function(C) {
    var m;
    var p;
    var p = {
        x: 0,
        y: 0
    };
})(C || (C = {}));
var D;
// code gen expected
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
