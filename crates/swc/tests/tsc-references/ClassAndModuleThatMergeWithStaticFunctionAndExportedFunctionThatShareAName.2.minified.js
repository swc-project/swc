//// [ClassAndModuleThatMergeWithStaticFunctionAndExportedFunctionThatShareAName.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var Point, A, Point1, Point2, A1, Point3 = function() {
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
Point = Point3 || (Point3 = {}), Point.Origin = function() {
    return null;
}, A = A1 || (A1 = {}), Point1 = function() {
    function Point(x, y) {
        _class_call_check(this, Point), this.x = x, this.y = y;
    }
    return Point.Origin = function() {
        return {
            x: 0,
            y: 0
        };
    }, Point;
}(), A.Point = Point1, Point2 = Point1 = A.Point || (A.Point = {}), Point2.Origin = function() {
    return "";
};
