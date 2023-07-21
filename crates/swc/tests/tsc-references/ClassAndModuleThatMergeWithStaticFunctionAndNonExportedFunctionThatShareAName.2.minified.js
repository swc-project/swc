//// [ClassAndModuleThatMergeWithStaticFunctionAndNonExportedFunctionThatShareAName.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var A, Point = function() {
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
Point || (Point = {}), function(A) {
    var Point = function() {
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
    A.Point = Point, A.Point || (A.Point = {});
}(A || (A = {}));
