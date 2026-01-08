//// [ExportClassWhichExtendsInterfaceWithInaccessibleType.ts]
var A;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(A || (A = {})).Point2d = /*#__PURE__*/ (function() {
    function Point2d(x, y) {
        _class_call_check(this, Point2d), this.x = x, this.y = y;
    }
    return Point2d.prototype.fromOrigin = function(p) {
        return 1;
    }, Point2d;
})();
