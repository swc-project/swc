var A, C, D, E;
import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
!function(A1) {
    var Point = function(x, y) {
        "use strict";
        _class_call_check(this, Point), this.x = x, this.y = y;
    };
    A1.Point = Point, A1.Origin = new Point(0, 0);
}(A || (A = {})), C || (C = {}), D || (D = {}), new A.Point(1, 1), function(E1) {
    var a = A;
    E1.xDist = function(x) {
        return a.Origin.x - x.x;
    };
}(E || (E = {}));
