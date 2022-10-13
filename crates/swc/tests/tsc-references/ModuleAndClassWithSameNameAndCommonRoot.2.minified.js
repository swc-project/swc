//// [module.ts]
!function(X1) {
    var Y, Point;
    (Point = (Y = X1.Y || (X1.Y = {})).Point || (Y.Point = {})).Origin = new Point(0, 0);
}(X = {});
//// [classPoint.ts]
var X;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function(X) {
    var Y, Point;
    Y = X.Y || (X.Y = {}), Point = function Point(x, y) {
        "use strict";
        _class_call_check(this, Point), this.x = x, this.y = y;
    }, Y.Point = Point;
}(X || (X = {}));
//// [simple.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
(A || (A = {})).Instance = new A();
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
