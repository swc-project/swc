//// [classAbstractInAModule.ts]
var M, M1, A, B;
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
M1 = M || (M = {}), A = function A() {
    _class_call_check(this, A);
}, M1.A = A, B = /*#__PURE__*/ function(A) {
    function B() {
        return _class_call_check(this, B), _call_super(this, B, arguments);
    }
    return _inherits(B, A), B;
}(A), M1.B = B, new M.A, new M.B;
