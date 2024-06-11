//// [module.d.ts]
//// [classPoint.ts]
var A;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(A || (A = {})).Point = function Point(x, y) {
    _class_call_check(this, Point), this.x = x, this.y = y;
};
//// [test.ts]
A.Point.Origin, new A.Point(0, 0);
