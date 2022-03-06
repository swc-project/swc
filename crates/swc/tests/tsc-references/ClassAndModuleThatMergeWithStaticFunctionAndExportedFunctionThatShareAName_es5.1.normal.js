import * as swcHelpers from "@swc/helpers";
var Point = /*#__PURE__*/ function() {
    "use strict";
    function Point(x, y) {
        swcHelpers.classCallCheck(this, Point);
        this.x = x;
        this.y = y;
    }
    swcHelpers.createClass(Point, null, [
        {
            key: "Origin",
            value: function Origin() {
                return {
                    x: 0,
                    y: 0
                };
            } // unexpected error here bug 840246
        }
    ]);
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
(function(A1) {
    var Point = /*#__PURE__*/ function() {
        "use strict";
        function Point(x, y) {
            swcHelpers.classCallCheck(this, Point);
            this.x = x;
            this.y = y;
        }
        swcHelpers.createClass(Point, null, [
            {
                key: "Origin",
                value: function Origin() {
                    return {
                        x: 0,
                        y: 0
                    };
                } // unexpected error here bug 840246
            }
        ]);
        return Point;
    }();
    A1.Point = Point;
    (function(Point) {
        function Origin() {
            return "";
        } //expected duplicate identifier error
        Point.Origin = Origin;
    })(Point = A1.Point || (A1.Point = {}));
})(A || (A = {}));
