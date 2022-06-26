import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var co2, cnd1, or1, or2, or3, and1, and3, propAcc1, M2, InitClass = function() {
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
function fnReturn2() {
    return fnReturn2;
}
fnReturn1(), fnReturn2();
var co2 = co2, cnd1 = cnd1 ? 0 : 1, or1 = or1 || "", or2 = or2, or3 = or3 || or3, and1 = and1 && "", and3 = and3 && and3;
function fnCall() {
    return fnCall();
}
function fnArg1(x, y) {
    fnArg1(fnArg1, 0);
}
fnCall();
var C = function() {
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
fn5();
var propAcc1 = {
    m: propAcc1.m
};
(M2 || (M2 = {})).x = M2.x;
var C2 = function() {
    "use strict";
    _class_call_check(this, C2), this.n = this.n;
};
new C2().n;
var C3 = function() {
    "use strict";
    _class_call_check(this, C3);
};
C3.q = C3.q, C3.q;
