//// [ExportModuleWithAccessibleTypesOnItsExportedMembers.ts]
var A, A1, Point, B, Line;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
A1 = A || (A = {}), Point = function Point(x, y) {
    _class_call_check(this, Point), this.x = x, this.y = y;
}, A1.Point = Point, (B = A1.B || (A1.B = {})).Origin = new Point(0, 0), Line = /*#__PURE__*/ function() {
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
