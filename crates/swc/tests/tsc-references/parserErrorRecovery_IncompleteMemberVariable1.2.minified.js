//// [parserErrorRecovery_IncompleteMemberVariable1.ts]
// Interface
var Shapes, Point, Shapes1;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
Shapes = Shapes1 || (Shapes1 = {}), // Static member
(Point = function() {
    function Point(x, y) {
        _class_call_check(this, Point), this.x = x, this.y = y;
    }
    return(// Instance member
    Point.prototype.getDist = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }, Point);
}()).origin = new Point(0, 0), Shapes.Point = Point, new Shapes1.Point(3, 4).getDist();
