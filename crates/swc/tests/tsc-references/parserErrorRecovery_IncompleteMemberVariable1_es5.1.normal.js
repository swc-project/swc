import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// Module
var Shapes;
(function(Shapes1) {
    var Point = /*#__PURE__*/ function() {
        "use strict";
        function Point(x, y) {
            _class_call_check(this, Point);
            this.x = x;
            this.y = y;
        }
        var _proto = Point.prototype;
        // Instance member
        _proto.getDist = function getDist() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        };
        return Point;
    }();
    // Static member
    Point.origin = new Point(0, 0);
    Shapes1.Point = Point;
})(Shapes || (Shapes = {}));
// Local variables
var p = new Shapes.Point(3, 4);
var dist = p.getDist();
