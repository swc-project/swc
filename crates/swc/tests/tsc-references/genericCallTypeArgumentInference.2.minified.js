//// [genericCallTypeArgumentInference.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function foo(t) {
    return t;
}
var i, r = foo("");
function foo2(t, u) {
    return u;
}
function foo2b(u) {}
var r2 = foo2("", 1), r3 = foo2b(1), C = function() {
    "use strict";
    function C(t, u) {
        _class_call_check(this, C), this.t = t, this.u = u;
    }
    var _proto = C.prototype;
    return _proto.foo = function(t, u) {
        return t;
    }, _proto.foo2 = function(t, u) {
        return u;
    }, _proto.foo3 = function(t, u) {
        return t;
    }, _proto.foo4 = function(t, u) {
        return t;
    }, _proto.foo5 = function(t, u) {
        return t;
    }, _proto.foo6 = function() {}, _proto.foo7 = function(u) {}, _proto.foo8 = function() {}, C;
}(), c = new C("", 1), r4 = c.foo("", 1), r5 = c.foo2("", 1), r6 = c.foo3(!0, 1), r7 = c.foo4("", !0), r8 = c.foo5(!0, 1), r9 = c.foo6(), r10 = c.foo7(""), r11 = c.foo8(), r4 = i.foo("", 1), r5 = i.foo2("", 1), r6 = i.foo3(!0, 1), r7 = i.foo4("", !0), r8 = i.foo5(!0, 1), r9 = i.foo6(), r10 = i.foo7(""), r11 = i.foo8();
