//// [a.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var Outer = {};
Outer.Inner = /*#__PURE__*/ function() {
    function _class() {
        _class_call_check(this, _class), this.x = 1;
    }
    return _class.prototype.m = function() {}, _class;
}(), (void 0).x, (void 0).m();
var inno = new Outer.Inner();
inno.x, inno.m();
