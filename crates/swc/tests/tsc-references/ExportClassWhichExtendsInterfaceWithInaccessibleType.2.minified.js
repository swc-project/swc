//// [ExportClassWhichExtendsInterfaceWithInaccessibleType.ts]
var A, A1;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
A1 = A || (A = {}), A1.Point2d = function() {
    function Point2d(x, y) {
        _class_call_check(this, Point2d), this.x = x, this.y = y;
    }
    var _proto = Point2d.prototype;
    return _proto.fromOrigin = function(p) {
        return 1;
    }, Point2d;
}();
