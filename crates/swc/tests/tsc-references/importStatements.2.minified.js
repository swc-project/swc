//// [importStatements.ts]
var A, C, D, E;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
!function(A) {
    var Point = function Point(x, y) {
        _class_call_check(this, Point), this.x = x, this.y = y;
    };
    A.Point = Point, A.Origin = new Point(0, 0);
}(A || (A = {})), C || (C = {}), D || (D = {}), new A.Point(1, 1), function(E) {
    var a = A;
    E.xDist = function(x) {
        return a.Origin.x - x.x;
    };
}(E || (E = {}));
