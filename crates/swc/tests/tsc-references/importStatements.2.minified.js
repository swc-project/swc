//// [importStatements.ts]
var A, C, D, E, A1, Point, Origin, E1, a;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
A1 = A || (A = {}), Point = function Point(x, y) {
    _class_call_check(this, Point), this.x = x, this.y = y;
}, A1.Point = Point, Origin = new Point(0, 0), Object.defineProperty(A1, "Origin", {
    enumerable: !0,
    get: function() {
        return Origin;
    },
    set: function(v) {
        Origin = v;
    }
}), C || (C = {}), D || (D = {}), new A.Point(1, 1), E1 = E || (E = {}), a = A, E1.xDist = function(x) {
    return a.Origin.x - x.x;
};
