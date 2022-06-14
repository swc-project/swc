import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Point = function Point(x, y) {
    "use strict";
    _class_call_check(this, Point);
    this.x = x;
    this.y = y;
};
Point.Origin = {
    x: 0,
    y: 0
};
(function(Point) {
    var Origin = Point.Origin = "";
})(Point || (Point = {}));
var A;
(function(A1) {
    var Point = function Point(x, y) {
        "use strict";
        _class_call_check(this, Point);
        this.x = x;
        this.y = y;
    };
    Point.Origin = {
        x: 0,
        y: 0
    };
    A1.Point = Point;
    (function(Point) {
        var Origin = Point.Origin = "";
    })(Point = A1.Point || (A1.Point = {}));
})(A || (A = {}));
