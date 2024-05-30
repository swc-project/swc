//// [classAbstractInAModule.ts]
var M, M1, A, B;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
M1 = M = {}, A = function A() {
    _class_call_check(this, A);
}, M1.A = A, B = function(A) {
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        return _class_call_check(this, B), _super.apply(this, arguments);
    }
    return B;
}(A), M1.B = B, new M.A, new M.B;
