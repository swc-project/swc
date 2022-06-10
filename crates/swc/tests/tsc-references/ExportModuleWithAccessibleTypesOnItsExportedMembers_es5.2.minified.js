var A;
import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
!function(A1) {
    var B, Line, Point = function(x, y) {
        "use strict";
        _class_call_check(this, Point), this.x = x, this.y = y;
    };
    A1.Point = Point, (B = A1.B || (A1.B = {})).Origin = new Point(0, 0), Line = function() {
        "use strict";
        function Line(start, end) {
            _class_call_check(this, Line);
        }
        return Line.fromOrigin = function(p) {
            return new Line({
                x: 0,
                y: 0
            }, p);
        }, Line;
    }(), B.Line = Line;
}(A || (A = {}));
