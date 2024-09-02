//// [circularImportAlias.ts]
var B, A, B1, D, A1;
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
(B1 = B || (B = {})).a = A, D = /*#__PURE__*/ function(_B_a_C) {
    function D() {
        return _class_call_check(this, D), _call_super(this, D, arguments);
    }
    return _inherits(D, _B_a_C), D;
}(B1.a.C), B1.D = D, (A1 = A || (A = {})).C = function C() {
    _class_call_check(this, C);
}, A1.b = B, new B.a.C();
