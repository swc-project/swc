//// [importStatements.ts]
var A, C, D, E;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function(A) {
    var Point = function Point(x, y) {
        "use strict";
        _class_call_check(this, Point), this.x = x, this.y = y;
    };
    A.Point = Point, A.Origin = new Point(0, 0);
}(A || (A = {})), C || (C = {}), D || (D = {}), new A.Point(1, 1), function(E) {
    var xDist = function(x) {
        return a.Origin.x - x.x;
    }, a = A;
    E.xDist = xDist;
}(E || (E = {}));
