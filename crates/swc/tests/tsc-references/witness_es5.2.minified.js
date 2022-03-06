import * as swcHelpers from "@swc/helpers";
var co2, cnd1, or1, or2, or3, and1, and3, propAcc1, M2, InitClass = function() {
    "use strict";
    function InitClass() {
        swcHelpers.classCallCheck(this, InitClass), this.x = this.x;
    }
    return swcHelpers.createClass(InitClass, [
        {
            key: "fn",
            value: function() {
                this.x;
            }
        }
    ]), InitClass;
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
        swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, [
        {
            key: "fn1",
            value: function() {
                return new (this.fn1())();
            }
        },
        {
            key: "fn2",
            value: function() {
                return new (this.fn2());
            }
        },
        {
            key: "fn3",
            value: function() {
                return new (void 0)(this.fn3);
            }
        }
    ]), C;
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
    swcHelpers.classCallCheck(this, C2), this.n = this.n;
};
new C2().n;
var C3 = function() {
    "use strict";
    swcHelpers.classCallCheck(this, C3);
};
C3.q = C3.q, C3.q;
