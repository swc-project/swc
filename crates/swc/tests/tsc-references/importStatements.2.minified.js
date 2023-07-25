//// [importStatements.ts]
var A, C, D, E, A1, Point, E1, a;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
A1 = A || (A = {}), Point = function Point(x, y) {
    _class_call_check(this, Point), this.x = x, this.y = y;
}, A1.Point = Point, A1.Origin = new Point(0, 0), C || (C = {}), D || (D = {}), new A.Point(1, 1), E1 = E || (E = {}), a = A, E1.xDist = function(x) {
    return a.Origin.x - x.x;
};
