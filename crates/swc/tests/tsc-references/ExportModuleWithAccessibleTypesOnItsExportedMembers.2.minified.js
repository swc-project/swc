//// [ExportModuleWithAccessibleTypesOnItsExportedMembers.ts]
var A, Point, B, Line;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
A = {}, Point = function Point(x, y) {
    _class_call_check(this, Point), this.x = x, this.y = y;
}, A.Point = Point, (B = A.B || (A.B = {})).Origin = new Point(0, 0), Line = function() {
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
