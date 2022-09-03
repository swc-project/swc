//// [class.ts]
var X;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function(X) {
    var Y, Point;
    Y = X.Y || (X.Y = {}), Point = function Point(x, y) {
        "use strict";
        _class_call_check(this, Point), this.x = x, this.y = y;
    }, Y.Point = Point;
}(X || (X = {}));
//// [module.ts]
var X;
!function(X) {
    var Y, Point;
    (Point = (Y = X.Y || (X.Y = {})).Point || (Y.Point = {})).Origin = new Point(0, 0);
}(X || (X = {}));
//// [test.ts]
var cl = new X.Y.Point(1, 1), cl = X.Y.Point.Origin;
//// [simple.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var a, A = function A() {
    "use strict";
    _class_call_check(this, A);
};
(A || (A = {})).Instance = new A();
var a = A.Instance, a = new A();
