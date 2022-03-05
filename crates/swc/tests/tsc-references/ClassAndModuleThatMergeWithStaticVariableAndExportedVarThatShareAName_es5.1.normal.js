import * as swcHelpers from "@swc/helpers";
var Point = function Point(x, y) {
    "use strict";
    swcHelpers.classCallCheck(this, Point);
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
        swcHelpers.classCallCheck(this, Point);
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
