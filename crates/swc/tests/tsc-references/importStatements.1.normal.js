//// [importStatements.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(function(A) {
    var Point = function Point(x, y) {
        "use strict";
        _class_call_check(this, Point);
        this.x = x;
        this.y = y;
    };
    A.Point = Point;
    A.Origin = new Point(0, 0);
})(A || (A = {}));
// no code gen expected
(function(C) {
    var m;
    var p;
    var p = {
        x: 0,
        y: 0
    };
})(C || (C = {}));
// code gen expected
(function(D) {
    var a = A;
    var p = new a.Point(1, 1);
})(D || (D = {}));
(function(E) {
    var a = A;
    function xDist(x) {
        return a.Origin.x - x.x;
    }
    E.xDist = xDist;
})(E || (E = {}));
var A, C, D, E;
