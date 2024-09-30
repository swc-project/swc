//// [ExportClassWhichExtendsInterfaceWithInaccessibleType.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(function(A) {
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
    A.Point2d = Point2d;
})(A || (A = {}));
var A;
