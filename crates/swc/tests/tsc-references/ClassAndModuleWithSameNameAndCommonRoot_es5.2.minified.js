import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function(X) {
    var Y, Point;
    Y = X.Y || (X.Y = {}), Point = function(x, y) {
        "use strict";
        _class_call_check(this, Point), this.x = x, this.y = y;
    }, Y.Point = Point;
}(X || (X = {})), function(X) {
    var Y, Point;
    (Point = (Y = X.Y || (X.Y = {})).Point || (Y.Point = {})).Origin = new Point(0, 0);
}(X || (X = {})), new X.Y.Point(1, 1), X.Y.Point.Origin;
var X, A = function() {
    "use strict";
    _class_call_check(this, A);
};
(A || (A = {})).Instance = new A(), A.Instance, new A();
