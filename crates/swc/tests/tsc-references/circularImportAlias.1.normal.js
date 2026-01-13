//// [circularImportAlias.ts]
// expected no error
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
(function(B) {
    B.a = A;
    var D = /*#__PURE__*/ function(_B_a_C) {
        "use strict";
        _inherits(D, _B_a_C);
        function D() {
            _class_call_check(this, D);
            return _call_super(this, D, arguments);
        }
        return D;
    }(B.a.C);
    B.D = D;
})(B || (B = {}));
(function(A) {
    var C = function C() {
        "use strict";
        _class_call_check(this, C);
    };
    A.C = C;
    A.b = B;
})(A || (A = {}));
var c;
var c = new B.a.C();
var B, A;
