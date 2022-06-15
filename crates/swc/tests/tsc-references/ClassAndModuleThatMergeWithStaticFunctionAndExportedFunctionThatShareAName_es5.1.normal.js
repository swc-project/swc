import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Point = /*#__PURE__*/ function() {
    "use strict";
    function Point(x, y) {
        _class_call_check(this, Point);
        this.x = x;
        this.y = y;
    }
    Point.Origin // unexpected error here bug 840246
     = function Origin() {
        return {
            x: 0,
            y: 0
        };
    };
    return Point;
}();
(function(Point) {
    var Origin = function Origin() {
        return null;
    } //expected duplicate identifier error
    ;
    Point.Origin = Origin;
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
        Point.Origin // unexpected error here bug 840246
         = function Origin() {
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
        } //expected duplicate identifier error
        Point.Origin = Origin;
    })(Point = A.Point || (A.Point = {}));
})(A || (A = {}));
