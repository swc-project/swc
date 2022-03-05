var A;
import * as swcHelpers from "@swc/helpers";
!function(A1) {
    var Point2d = function() {
        "use strict";
        function Point2d(x, y) {
            swcHelpers.classCallCheck(this, Point2d), this.x = x, this.y = y;
        }
        return swcHelpers.createClass(Point2d, [
            {
                key: "fromOrigin",
                value: function(p) {
                    return 1;
                }
            }
        ]), Point2d;
    }();
    A1.Point2d = Point2d;
}(A || (A = {}));
