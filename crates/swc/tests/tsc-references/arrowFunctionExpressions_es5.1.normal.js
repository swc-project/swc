import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _sliced_to_array from "@swc/helpers/lib/_sliced_to_array.js";
import _to_array from "@swc/helpers/lib/_to_array.js";
// ArrowFormalParameters => AssignmentExpression is equivalent to ArrowFormalParameters => { return AssignmentExpression; }
var a = function(p) {
    return p.length;
};
var a = function(p) {
    return p.length;
};
// Identifier => Block is equivalent to(Identifier) => Block
var b = function(j) {
    return 0;
};
var b = function(j) {
    return 0;
};
// Identifier => AssignmentExpression is equivalent to(Identifier) => AssignmentExpression
var c;
var d = function(n) {
    return c = n;
};
var d = function(n) {
    return c = n;
};
var d;
// Binding patterns in arrow functions
var p1 = function(param) {
    var _param = _sliced_to_array(param, 1), a = _param[0];
};
var p2 = function(param) {
    var _param = _to_array(param), a = _param.slice(0);
};
var p3 = function(param) {
    var _param = _sliced_to_array(param, 2), a = _param[1];
};
var p4 = function(param) {
    var _param = _to_array(param), a = _param.slice(1);
};
var p5 = function(param) {
    var _param = _sliced_to_array(param, 1), tmp = _param[0], a = tmp === void 0 ? 1 : tmp;
};
var p6 = function(param) {
    var a = param.a;
};
var p7 = function(param) {
    var b = param.a.b;
};
var p8 = function(param) {
    var _a = param.a, a = _a === void 0 ? 1 : _a;
};
var p9 = function(param) {
    var tmp = param.a, ref = tmp === void 0 ? {
        b: 1
    } : tmp, _b = ref.b, b = _b === void 0 ? 1 : _b;
};
var p10 = function(param) {
    var _param = _sliced_to_array(param, 1), ref = _param[0], value = ref.value, done = ref.done;
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
        var m = function(n) {
            return n + 1;
        };
        var p = function(n) {
            return n && _this;
        };
    };
    return MyClass;
}();
// Arrow function used in arrow function
var arrrr = function() {
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
    var arr = function(n) {
        return function(p) {
            return p * n;
        };
    };
    arr(3)(4).toExponential();
}
// Arrow function used in function
function someOtherFn() {
    var arr = function(n) {
        return "" + n;
    };
    arr(4).charAt(0);
}
// Arrow function used in nested function in function
function outerFn() {
    var innerFn = function innerFn() {
        var arrowFn = function() {};
        var p = arrowFn();
        var p;
    };
}
// Arrow function used in nested function in arrow function
var f = function(n) {
    var fn = function fn(x) {
        return function() {
            return n + x;
        };
    };
    return fn(4);
};
var g = f("")();
var g;
// Arrow function used in nested function in arrow function in nested function
function someOuterFn() {
    var arr = function(n) {
        var innerFn = function innerFn() {
            return function() {
                return n.length;
            };
        };
        return innerFn;
    };
    return arr;
}
var h = someOuterFn()("")()();
h.toExponential();
// Arrow function used in try/catch/finally in function
function tryCatchFn() {
    try {
        var _this = this;
        var x = function() {
            return _this;
        };
    } catch (e1) {
        var _this1 = this;
        var t = function() {
            return e1 + _this1;
        };
    } finally{
        var _this2 = this;
        var m = function() {
            return _this2 + "";
        };
    }
}
