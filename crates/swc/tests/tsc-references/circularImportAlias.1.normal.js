//// [circularImportAlias.ts]
// expected no error
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var B;
(function(B) {
    var a = A;
    B.a = a;
    var D = /*#__PURE__*/ function(_a_C) {
        "use strict";
        _inherits(D, _a_C);
        var _super = _create_super(D);
        function D() {
            _class_call_check(this, D);
            return _super.apply(this, arguments);
        }
        return D;
    }(a.C);
    B.D = D;
})(B || (B = {}));
var A;
(function(A) {
    var C = function C() {
        "use strict";
        _class_call_check(this, C);
    };
    A.C = C;
    var b = B;
    A.b = b;
})(A || (A = {}));
var c;
var c = new B.a.C();
