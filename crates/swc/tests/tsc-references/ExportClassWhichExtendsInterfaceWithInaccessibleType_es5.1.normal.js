import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var A;
(function(A1) {
    var Point2d = /*#__PURE__*/ function() {
        "use strict";
        function Point2d(x, y) {
            _class_call_check(this, Point2d);
            this.x = x;
            this.y = y;
        }
        var _proto = Point2d.prototype;
        _proto.fromOrigin = function fromOrigin(p) {
            return 1;
        };
        return Point2d;
    }();
    A1.Point2d = Point2d;
})(A || (A = {}));
