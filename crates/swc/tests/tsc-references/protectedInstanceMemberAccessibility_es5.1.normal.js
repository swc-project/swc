import * as swcHelpers from "@swc/helpers";
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    var _proto = A.prototype;
    _proto.f = function f() {
        return "hello";
    };
    return A;
}();
var B = /*#__PURE__*/ function(A) {
    "use strict";
    swcHelpers.inherits(B, A);
    var _super = swcHelpers.createSuper(B);
    function B() {
        swcHelpers.classCallCheck(this, B);
        return _super.apply(this, arguments);
    }
    var _proto = B.prototype;
    _proto.g = function g() {
        var t1 = this.x;
        var t2 = this.f();
        var t3 = this.y;
        var t4 = this.z; // error
        var s1 = swcHelpers.get(swcHelpers.getPrototypeOf(B.prototype), "x", this); // error
        var s2 = swcHelpers.get(swcHelpers.getPrototypeOf(B.prototype), "f", this).call(this);
        var s3 = swcHelpers.get(swcHelpers.getPrototypeOf(B.prototype), "y", this); // error
        var s4 = swcHelpers.get(swcHelpers.getPrototypeOf(B.prototype), "z", this); // error
        var a;
        var a1 = a.x; // error
        var a2 = a.f(); // error
        var a3 = a.y; // error
        var a4 = a.z; // error
        var b;
        var b1 = b.x;
        var b2 = b.f();
        var b3 = b.y;
        var b4 = b.z; // error
        var c;
        var c1 = c.x; // error
        var c2 = c.f(); // error
        var c3 = c.y; // error
        var c4 = c.z; // error
    };
    return B;
}(A);
var C = /*#__PURE__*/ function(A) {
    "use strict";
    swcHelpers.inherits(C, A);
    var _super = swcHelpers.createSuper(C);
    function C() {
        swcHelpers.classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(A);
