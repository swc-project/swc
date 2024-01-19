//// [circularImportAlias.ts]
var B, A, B1, A1;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
B1 = B || (B = {}), B1.a = A, B1.D = function(_B_a_C) {
    _inherits(D, _B_a_C);
    var _super = _create_super(D);
    function D() {
        return _class_call_check(this, D), _super.apply(this, arguments);
    }
    return D;
}(B1.a.C), A1 = A || (A = {}), A1.C = function C() {
    _class_call_check(this, C);
}, A1.b = B, new B.a.C();
