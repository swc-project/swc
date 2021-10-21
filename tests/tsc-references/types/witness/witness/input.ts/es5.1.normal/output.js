function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
// Initializers
var varInit = varInit; // any
var pInit1;
function fn(param) {
    var pInit = param === void 0 ? pInit : param;
    var pInit;
}
var InitClass = /*#__PURE__*/ function() {
    "use strict";
    function InitClass() {
        _classCallCheck(this, InitClass);
        this.x = this.x;
    }
    _createClass(InitClass, [
        {
            key: "fn",
            value: function fn() {
                var y = this.x;
                var y;
            }
        }
    ]);
    return InitClass;
}();
// Return type
function fnReturn1() {
    return fnReturn1();
}
var a1;
var a1 = fnReturn1();
function fnReturn2() {
    return fnReturn2;
}
var fnr2 = fnReturn2();
// Comma
var co1 = (co1, 3);
var co1;
var co2 = (3, co2);
var co2;
var co3 = (co1, co2, co3, co1);
var co3;
// Assignment
var as1 = as1 = 2;
var as1;
var as2 = as2 = as2 = 2;
var as2;
// Conditional
var cnd1 = cnd1 ? 0 : 1;
var cnd1;
var cnd2 = cnd1 ? cnd1 ? '' : "" : '';
var cnd2;
// ||
var or1 = or1 || '';
var or1;
var or2 = '' || or2;
var or2;
var or3 = or3 || or3;
var or3;
// &&
var and1 = and1 && '';
var and1;
var and2 = '' && and2;
var and2;
var and3 = and3 && and3;
var and3;
// function call return type
function fnCall() {
    return fnCall();
}
var fnCallResult = fnCall();
var fnCallResult;
// Call argument
function fnArg1(x, y) {
    var x;
    fnArg1(fnArg1, 0);
}
function overload1() {
    return undefined;
}
function fnArg2() {
    return overload1(fnArg2);
}
var t = fnArg2(); // t: should be 'any', but is 'string'
var C = // New operator
/*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    _createClass(C, [
        {
            key: "fn1",
            value: function fn1() {
                return new (this.fn1())();
            }
        },
        {
            key: "fn2",
            value: function fn2() {
                return new (this.fn2());
            }
        },
        {
            key: "fn3",
            value: function fn3() {
                var a;
                return new a(this.fn3);
            }
        }
    ]);
    return C;
}();
function fn5() {
    var a;
    return new a(fn5);
}
var fn5r = fn5(); // fn5r: should be 'any', but is 'number'
// Property access
var propAcc1 = {
    m: propAcc1.m
};
var propAcc1;
// Property access of module member
var M21;
(function(M2) {
    M2.x = M21.x;
    var y = x;
    var y;
})(M21 || (M21 = {
}));
var C2 = function C2() {
    "use strict";
    _classCallCheck(this, C2);
    // Property access of class instance type
    this.n // n: any
     = this.n;
};
var c2inst = new C2().n;
var c2inst;
var C3 = function C3() {
    "use strict";
    _classCallCheck(this, C3);
};
C3.q = C3.q;
var qq = C3.q;
var qq; // Parentheses - tested a bunch above
