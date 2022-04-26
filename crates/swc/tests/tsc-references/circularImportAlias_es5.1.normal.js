import * as swcHelpers from "@swc/helpers";
// expected no error
var B;
(function(B1) {
    var a = A;
    B1.a = a;
    var D = /*#__PURE__*/ function(_C) {
        "use strict";
        swcHelpers.inherits(D, _C);
        var _super = swcHelpers.createSuper(D);
        function D() {
            swcHelpers.classCallCheck(this, D);
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
        swcHelpers.classCallCheck(this, C);
    };
    A.C = C;
    var b = B;
    A.b = b;
})(A1 || (A1 = {}));
var c;
var c = new B.a.C();
