import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
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
(function(A) {
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
    A.Point = Point;
    (function(Point) {
        function Origin() {
            return "";
        } // not an error since not exported
    })(Point = A.Point || (A.Point = {}));
})(A || (A = {}));
