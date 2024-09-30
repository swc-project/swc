//// [ClassAndModuleThatMergeWithStaticFunctionAndExportedFunctionThatShareAName.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var A, Point, A1, Point1 = /*#__PURE__*/ function() {
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
(Point1 || (Point1 = {})).Origin = function() {
    return null;
}, A = A1 || (A1 = {}), Point = /*#__PURE__*/ function() {
    function Point(x, y) {
        _class_call_check(this, Point), this.x = x, this.y = y;
    }
    return Point.Origin = function() {
        return {
            x: 0,
            y: 0
        };
    }, Point;
}(), A.Point = Point, (A.Point || (A.Point = {})).Origin = function() {
    return "";
};
