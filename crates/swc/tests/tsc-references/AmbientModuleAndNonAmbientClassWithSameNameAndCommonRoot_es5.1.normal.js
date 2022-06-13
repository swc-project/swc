import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @filename: classPoint.ts
var A;
(function(A1) {
    var Point = function Point(x, y) {
        "use strict";
        _class_call_check(this, Point);
        this.x = x;
        this.y = y;
    };
    A1.Point = Point;
})(A || (A = {}));
// @filename: test.ts
var p;
var p = A.Point.Origin;
var p = new A.Point(0, 0); // unexpected error here, bug 840000
