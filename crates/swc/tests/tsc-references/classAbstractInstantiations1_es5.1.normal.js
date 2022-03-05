import * as swcHelpers from "@swc/helpers";
var A = function A() {
    "use strict";
    swcHelpers.classCallCheck(this, A);
};
var B = /*#__PURE__*/ function(A) {
    "use strict";
    swcHelpers.inherits(B, A);
    var _super = swcHelpers.createSuper(B);
    function B() {
        swcHelpers.classCallCheck(this, B);
        return _super.apply(this, arguments);
    }
    return B;
}(A);
var C = /*#__PURE__*/ function(B) {
    "use strict";
    swcHelpers.inherits(C, B);
    var _super = swcHelpers.createSuper(C);
    function C() {
        swcHelpers.classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
new A;
new A(1); // should report 1 error
new B;
new C;
var a;
var b;
var c;
a = new B;
b = new B;
c = new B;
