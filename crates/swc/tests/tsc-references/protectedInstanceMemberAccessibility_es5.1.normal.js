import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _get from "@swc/helpers/lib/_get.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    var _proto = A.prototype;
    _proto.f = function f() {
        return "hello";
    };
    return A;
}();
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        _class_call_check(this, B);
        return _super.apply(this, arguments);
    }
    var _proto = B.prototype;
    _proto.g = function g() {
        var t1 = this.x;
        var t2 = this.f();
        var t3 = this.y;
        var t4 = this.z; // error
        var s1 = _get(_get_prototype_of(B.prototype), "x", this); // error
        var s2 = _get(_get_prototype_of(B.prototype), "f", this).call(this);
        var s3 = _get(_get_prototype_of(B.prototype), "y", this); // error
        var s4 = _get(_get_prototype_of(B.prototype), "z", this); // error
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
    _inherits(C, A);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(A);
