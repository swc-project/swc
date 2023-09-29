//// [circularImportAlias.ts]
// expected no error
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var B;
(function(B) {
    B.a = A;
    var D = /*#__PURE__*/ function(_B_a_C) {
        "use strict";
        _inherits(D, _B_a_C);
        var _super = _create_super(D);
        function D() {
            _class_call_check(this, D);
            return _super.apply(this, arguments);
        }
        return D;
    }(B.a.C);
    B.D = D;
})(B || (B = {}));
var A;
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
