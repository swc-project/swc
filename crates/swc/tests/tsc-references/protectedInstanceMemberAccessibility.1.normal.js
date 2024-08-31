//// [protectedInstanceMemberAccessibility.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
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
    function B() {
        _class_call_check(this, B);
        return _call_super(this, B, arguments);
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
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(A);
