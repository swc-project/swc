//// [witness.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var pInit, a, co1, co2, co3, as1, as2, cnd1, cnd2, or1, or2, or3, and1, and2, and3, fnCallResult, propAcc1, M2, c2inst, qq, varInit = varInit;
function fn() {
    var pInit, pInit = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : pInit;
}
var InitClass = function() {
    "use strict";
    function InitClass() {
        _class_call_check(this, InitClass), this.x = this.x;
    }
    return InitClass.prototype.fn = function() {
        this.x;
    }, InitClass;
}();
function fnReturn1() {
    return fnReturn1();
}
var a = fnReturn1();
function fnReturn2() {
    return fnReturn2;
}
var fnr2 = fnReturn2(), co1 = 3, co2 = co2, co3 = co1, as1 = as1 = 2, as2 = as2 = as2 = 2, cnd1 = cnd1 ? 0 : 1, cnd2 = "", or1 = or1 || "", or2 = or2, or3 = or3 || or3, and1 = and1 && "", and2 = "", and3 = and3 && and3;
function fnCall() {
    return fnCall();
}
var fnCallResult = fnCall();
function fnArg1(x, y) {
    fnArg1(fnArg1, 0);
}
function overload1() {}
function fnArg2() {
    return overload1(fnArg2);
}
var t = fnArg2(), C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    return _proto.fn1 = function() {
        return new (this.fn1())();
    }, _proto.fn2 = function() {
        return new (this.fn2());
    }, _proto.fn3 = function() {
        return new (void 0)(this.fn3);
    }, C;
}();
function fn5() {
    return new (void 0)(fn5);
}
var fn5r = fn5(), propAcc1 = {
    m: propAcc1.m
};
(M2 || (M2 = {})).x = M2.x;
var C2 = function C2() {
    "use strict";
    _class_call_check(this, C2), this.n = this.n;
}, c2inst = new C2().n, C3 = function C3() {
    "use strict";
    _class_call_check(this, C3);
};
C3.q = C3.q;
var qq = C3.q;
