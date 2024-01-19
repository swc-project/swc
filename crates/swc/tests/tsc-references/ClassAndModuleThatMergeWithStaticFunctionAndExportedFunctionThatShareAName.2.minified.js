//// [ClassAndModuleThatMergeWithStaticFunctionAndExportedFunctionThatShareAName.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var Point, A, Point1, A1, Point2 = function() {
    function Point(x, y) {
        _class_call_check(this, Point), this.x = x, this.y = y;
    }
    return Point.Origin = function() {
        return {
            x: 0,
            y: 0
        };
    }, Point;
}();
Point = Point2 || (Point2 = {}), Point.Origin = function() {
    return null;
}, A = A1 || (A1 = {}), A.Point = function() {
    function Point(x, y) {
        _class_call_check(this, Point), this.x = x, this.y = y;
    }
    return Point.Origin = function() {
        return {
            x: 0,
            y: 0
        };
    }, Point;
}(), Point1 = A.Point || (A.Point = {}), Point1.Origin = function() {
    return "";
};
