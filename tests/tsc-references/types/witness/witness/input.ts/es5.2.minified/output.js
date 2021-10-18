function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
}
var InitClass = function() {
    "use strict";
    function InitClass() {
        _classCallCheck(this, InitClass), this.x = this.x;
    }
    return _createClass(InitClass, [
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
var co2, cnd1, or3, and3, propAcc1, M2, co2 = co2, cnd1 = cnd1 ? 0 : 1, or3 = or3 || or3, and3 = and3 && and3;
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
        _classCallCheck(this, C);
    }
    return _createClass(C, [
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
(M2 || (M2 = {
})).x = M2.x;
var C2 = function() {
    "use strict";
    _classCallCheck(this, C2), this.n = this.n;
};
new C2().n;
var C3 = function() {
    "use strict";
    _classCallCheck(this, C3);
};
C3.q = C3.q, C3.q;
