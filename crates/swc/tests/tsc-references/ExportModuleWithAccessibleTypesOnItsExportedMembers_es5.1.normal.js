import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var A;
(function(A1) {
    var Point = function Point(x, y) {
        "use strict";
        _class_call_check(this, Point);
        this.x = x;
        this.y = y;
    };
    A1.Point = Point;
    var B1;
    (function(B) {
        var Origin = B.Origin = new Point(0, 0);
        var Line = /*#__PURE__*/ function() {
            "use strict";
            function Line(start, end) {
                _class_call_check(this, Line);
            }
            Line.fromOrigin = function fromOrigin(p) {
                return new Line({
                    x: 0,
                    y: 0
                }, p);
            };
            return Line;
        }();
        B.Line = Line;
    })(B1 = A1.B || (A1.B = {}));
})(A || (A = {}));
