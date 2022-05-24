import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
// expected no error
var B;
(function(B1) {
    var a = A;
    B1.a = a;
    var D = /*#__PURE__*/ function(_C) {
        "use strict";
        _inherits(D, _C);
        var _super = _create_super(D);
        function D() {
            _class_call_check(this, D);
            return _super.apply(this, arguments);
        }
        return D;
    }(a.C);
    B1.D = D;
})(B || (B = {}));
var A1;
(function(A) {
    var C = function C() {
        "use strict";
        _class_call_check(this, C);
    };
    A.C = C;
    var b = B;
    A.b = b;
})(A1 || (A1 = {}));
var c;
var c = new B.a.C();
