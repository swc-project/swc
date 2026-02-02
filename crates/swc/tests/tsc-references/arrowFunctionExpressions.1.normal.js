//// [arrowFunctionExpressions.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _to_array } from "@swc/helpers/_/_to_array";
// ArrowFormalParameters => AssignmentExpression is equivalent to ArrowFormalParameters => { return AssignmentExpression; }
var a = function a(p) {
    return p.length;
};
var a = function a(p) {
    return p.length;
};
// Identifier => Block is equivalent to(Identifier) => Block
var b = function b(j) {
    return 0;
};
var b = function b(j) {
    return 0;
};
// Identifier => AssignmentExpression is equivalent to(Identifier) => AssignmentExpression
var c;
var d = function d(n) {
    return c = n;
};
var d = function d(n) {
    return c = n;
};
var d;
// Binding patterns in arrow functions
var p1 = function p1(param) {
    var _param = _sliced_to_array(param, 1), a = _param[0];
};
var p2 = function p2(param) {
    var _param = _to_array(param), a = _param.slice(0);
};
var p3 = function p3(param) {
    var _param = _sliced_to_array(param, 2), a = _param[1];
};
var p4 = function p4(param) {
    var _param = _to_array(param), a = _param.slice(1);
};
var p5 = function p5(param) {
    var _param = _sliced_to_array(param, 1), tmp = _param[0], a = tmp === void 0 ? 1 : tmp;
};
var p6 = function p6(param) {
    var a = param.a;
};
var p7 = function p7(param) {
    var b = param.a.b;
};
var p8 = function p8(param) {
    var _param_a = param.a, a = _param_a === void 0 ? 1 : _param_a;
};
var p9 = function p9(param) {
    var tmp = param.a, _ref = tmp === void 0 ? {
        b: 1
    } : tmp, _ref_b = _ref.b, b = _ref_b === void 0 ? 1 : _ref_b;
};
var p10 = function p10(param) {
    var _param = _sliced_to_array(param, 1), _param_ = _param[0], value = _param_.value, done = _param_.done;
};
// Arrow function used in class member initializer
// Arrow function used in class member function
var MyClass = /*#__PURE__*/ function() {
    "use strict";
    function MyClass() {
        var _this = this;
        _class_call_check(this, MyClass);
        this.m = function(n) {
            return n + 1;
        };
        this.p = function(n) {
            return n && _this;
        };
    }
    var _proto = MyClass.prototype;
    _proto.fn = function fn() {
        var _this = this;
        var m = function m(n) {
            return n + 1;
        };
        var p = function p(n) {
            return n && _this;
        };
    };
    return MyClass;
}();
// Arrow function used in arrow function
var arrrr = function arrrr() {
    return function(m) {
        return function() {
            return function(n) {
                return m + n;
            };
        };
    };
};
var e = arrrr()(3)()(4);
var e;
// Arrow function used in arrow function used in function
function someFn() {
    var arr = function arr(n) {
        return function(p) {
            return p * n;
        };
    };
    arr(3)(4).toExponential();
}
// Arrow function used in function
function someOtherFn() {
    var arr = function arr(n) {
        return '' + n;
    };
    arr(4).charAt(0);
}
// Arrow function used in nested function in function
function outerFn() {
    function innerFn() {
        var arrowFn = function arrowFn() {};
        var p = arrowFn();
        var p;
    }
}
// Arrow function used in nested function in arrow function
var f = function f(n) {
    var fn = function fn(x) {
        return function() {
            return n + x;
        };
    };
    return fn(4);
};
var g = f('')();
var g;
// Arrow function used in nested function in arrow function in nested function
function someOuterFn() {
    var arr = function arr(n) {
        var innerFn = function innerFn() {
            return function() {
                return n.length;
            };
        };
        return innerFn;
    };
    return arr;
}
var h = someOuterFn()('')()();
h.toExponential();
// Arrow function used in try/catch/finally in function
function tryCatchFn() {
    var _this = this;
    try {
        var x = function x() {
            return _this;
        };
    } catch (e) {
        var t = function t() {
            return e + _this;
        };
    } finally{
        var m = function m() {
            return _this + '';
        };
    }
}
