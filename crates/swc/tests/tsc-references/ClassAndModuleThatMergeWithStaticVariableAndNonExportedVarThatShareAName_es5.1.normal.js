import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
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
    var Origin = ""; // not an error, since not exported
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
        var Origin = ""; // not an error since not exported
    })(Point = A1.Point || (A1.Point = {}));
})(A || (A = {}));
