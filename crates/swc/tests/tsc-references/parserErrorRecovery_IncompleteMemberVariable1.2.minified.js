//// [parserErrorRecovery_IncompleteMemberVariable1.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function(Shapes) {
    var Point = function() {
        "use strict";
        function Point(x, y) {
            _class_call_check(this, Point), this.x = x, this.y = y;
        }
        return Point.prototype.getDist = function() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }, Point;
    }();
    Point.origin = new Point(0, 0), Shapes.Point = Point;
}(Shapes || (Shapes = {}));
var Shapes, p = new Shapes.Point(3, 4), dist = p.getDist();
