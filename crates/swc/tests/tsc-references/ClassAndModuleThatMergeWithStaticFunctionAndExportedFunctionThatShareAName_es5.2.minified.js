import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var A, Point = function() {
    "use strict";
    function Point(x, y) {
        _class_call_check(this, Point), this.x = x, this.y = y;
    }
    return Point.Origin = function() {
        return {
            x: 0,
            y: 0
        };
    }, Point;
}();
!function(Point) {
    var Origin = function() {
        return null;
    };
    Point.Origin = Origin;
}(Point || (Point = {})), function(A) {
    var Point = function() {
        "use strict";
        function Point(x, y) {
            _class_call_check(this, Point), this.x = x, this.y = y;
        }
        return Point.Origin = function() {
            return {
                x: 0,
                y: 0
            };
        }, Point;
    }();
    A.Point = Point, function(Point) {
        function Origin() {
            return "";
        }
        Point.Origin = Origin;
    }(Point = A.Point || (A.Point = {}));
}(A || (A = {}));
