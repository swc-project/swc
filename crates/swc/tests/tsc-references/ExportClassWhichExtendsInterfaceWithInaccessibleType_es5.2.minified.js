var A;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function(A) {
    var Point2d = function() {
        "use strict";
        function Point2d(x, y) {
            _class_call_check(this, Point2d), this.x = x, this.y = y;
        }
        return Point2d.prototype.fromOrigin = function(p) {
            return 1;
        }, Point2d;
    }();
    A.Point2d = Point2d;
}(A || (A = {}));
