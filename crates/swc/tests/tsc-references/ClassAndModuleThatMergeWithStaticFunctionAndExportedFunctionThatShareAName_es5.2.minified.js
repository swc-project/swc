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
(Point || (Point = {})).Origin = function() {
    return null;
}, function(A1) {
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
    A1.Point = Point, function(Point) {
        function Origin() {
            return "";
        }
        Point.Origin = Origin;
    }(Point = A1.Point || (A1.Point = {}));
}(A || (A = {}));
