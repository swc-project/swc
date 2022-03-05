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
var A;
(function(A1) {
    var C = function C() {
        "use strict";
        swcHelpers.classCallCheck(this, C);
    };
    A1.C = C;
    var b = B;
    A1.b = b;
})(A || (A = {}));
var c;
var c = new B.a.C();
