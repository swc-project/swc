//// [classAbstractInAModule.ts]
var M, M1, A;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
M1 = M || (M = {}), M1.A = A = function A() {
    _class_call_check(this, A);
}, M1.B = function(A) {
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        return _class_call_check(this, B), _super.apply(this, arguments);
    }
    return B;
}(A), new M.A, new M.B;
