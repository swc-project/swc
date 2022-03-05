var Shapes;
import * as swcHelpers from "@swc/helpers";
!function(Shapes1) {
    var Point = function() {
        "use strict";
        function Point(x, y) {
            swcHelpers.classCallCheck(this, Point), this.x = x, this.y = y;
        }
        return swcHelpers.createClass(Point, [
            {
                key: "getDist",
                value: function() {
                    return Math.sqrt(this.x * this.x + this.y * this.y);
                }
            }
        ]), Point;
    }();
    Point.origin = new Point(0, 0), Shapes1.Point = Point;
}(Shapes || (Shapes = {})), new Shapes.Point(3, 4).getDist();
