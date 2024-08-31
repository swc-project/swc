//// [classWithProtectedProperty.ts]
// accessing any protected outside the class is an error
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
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
C.g = function() {
    return '';
};
var D = /*#__PURE__*/ function(C1) {
    "use strict";
    _inherits(D, C1);
    function D() {
        _class_call_check(this, D);
        return _call_super(this, D, arguments);
    }
    var _proto = D.prototype;
    _proto.method = function method() {
        // No errors
        var d = new D();
        var r1 = d.x;
        var r2 = d.a;
        var r3 = d.b;
        var r4 = d.c();
        var r5 = d.d();
        var r6 = C.e;
        var r7 = C.f();
        var r8 = C.g();
    };
    return D;
}(C);
