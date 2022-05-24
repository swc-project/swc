import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var Point = /*#__PURE__*/ function() {
    "use strict";
    function Point(x, y) {
        _class_call_check(this, Point);
        this.x = x;
        this.y = y;
    }
    Point.Origin = function Origin() {
        return {
            x: 0,
            y: 0
        };
    };
    return Point;
}();
(function(Point) {
    var Origin = function Origin() {
        return "";
    } // not an error, since not exported
    ;
})(Point || (Point = {}));
var A;
(function(A1) {
    var Point = /*#__PURE__*/ function() {
        "use strict";
        function Point(x, y) {
            _class_call_check(this, Point);
            this.x = x;
            this.y = y;
        }
        Point.Origin = function Origin() {
            return {
                x: 0,
                y: 0
            };
        };
        return Point;
    }();
    A1.Point = Point;
    (function(Point) {
        function Origin() {
            return "";
        } // not an error since not exported
    })(Point = A1.Point || (A1.Point = {}));
})(A || (A = {}));
