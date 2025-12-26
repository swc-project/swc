//// [typeOfThisInStaticMembers4.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var D = /*#__PURE__*/ function(C) {
    function D() {
        return _class_call_check(this, D), _call_super(this, D, arguments);
    }
    return _inherits(D, C), D;
}(function C() {
    _class_call_check(this, C);
});
_define_property(D, "c", 2), _define_property(D, "d", D.c + 1), _define_property(D, "e", super.a + D.c + 1);
