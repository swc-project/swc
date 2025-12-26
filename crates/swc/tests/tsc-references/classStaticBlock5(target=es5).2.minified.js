//// [classStaticBlock5.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var B = function B() {
    _class_call_check(this, B);
};
B.a = 1, B.b = 2;
var C = /*#__PURE__*/ function(B) {
    function C() {
        return _class_call_check(this, C), _call_super(this, C, arguments);
    }
    return _inherits(C, B), C;
}(B);
C.b = 3, C.c = _get(_get_prototype_of(C), "a", C), C.b, _get(_get_prototype_of(C), "b", C), _get(_get_prototype_of(C), "a", C);
