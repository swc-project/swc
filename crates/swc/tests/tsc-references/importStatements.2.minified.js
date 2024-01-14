//// [importStatements.ts]
var A, C, D, A1, Point, a;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
A1 = A || (A = {}), Point = function Point(x, y) {
    _class_call_check(this, Point), this.x = x, this.y = y;
}, A1.Point = Point, A1.Origin = new Point(0, 0), C || (C = {}), D || (D = {}), new A.Point(1, 1), a = A, E.xDist = function(x) {
    return a.Origin.x - x.x;
};
