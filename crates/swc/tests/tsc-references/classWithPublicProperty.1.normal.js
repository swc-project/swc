//// [classWithPublicProperty.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var __ = new WeakMap();
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
        this.a = '';
        this.b = '';
        this.d = function() {
            return '';
        };
    }
    var _proto = C.prototype;
    _proto.c = function c() {
        return '';
    };
    C.f = function f() {
        return '';
    };
    return C;
}();
__.set(C, {
    writable: true,
    value: C.g = function() {
        return '';
    }
});
// all of these are valid
var c = new C();
var r1 = c.x;
var r2 = c.a;
var r3 = c.b;
var r4 = c.c();
var r5 = c.d();
var r6 = C.e;
var r7 = C.f();
var r8 = C.g();
