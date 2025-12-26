//// [typeOfThisInStaticMembers3.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var C = function C() {
    _class_call_check(this, C);
};
C.a = 1, C.b = C.a + 1;
var D = /*#__PURE__*/ function(C) {
    function D() {
        return _class_call_check(this, D), _call_super(this, D, arguments);
    }
    return _inherits(D, C), D;
}(C);
D.c = 2, D.d = D.c + 1, D.e = _get(_get_prototype_of(D), "a", D) + D.c + 1;
