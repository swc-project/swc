//// [module.d.ts]
//// [classPoint.ts]
var A;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
(A || (A = {})).Point = function Point(x, y) {
    "use strict";
    _class_call_check(this, Point), this.x = x, this.y = y;
};
//// [test.ts]
A.Point.Origin, new A.Point(0, 0);
