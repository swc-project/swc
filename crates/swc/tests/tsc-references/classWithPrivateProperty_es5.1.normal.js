import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// accessing any private outside the class is an error
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
        this.a = "";
        this.b = "";
        this.d = function() {
            return "";
        };
    }
    var _proto = C.prototype;
    _proto.c = function c() {
        return "";
    };
    C.f = function f() {
        return "";
    };
    return C;
}();
C.g = function() {
    return "";
};
var c = new C();
var r1 = c.x;
var r2 = c.a;
var r3 = c.b;
var r4 = c.c();
var r5 = c.d();
var r6 = C.e;
var r7 = C.f();
var r8 = C.g();
