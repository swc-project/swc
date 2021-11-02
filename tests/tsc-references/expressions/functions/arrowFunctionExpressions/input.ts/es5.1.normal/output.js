function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
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
function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}
function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
        for(var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}
function _toArray(arr) {
    return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest();
}
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
    var _param = _slicedToArray(param, 1), a = _param[0];
};
var p2 = function(param) {
    var _param = _toArray(param), a = _param.slice(0);
};
var p3 = function(param) {
    var _param = _slicedToArray(param, 2), a = _param[1];
};
var p4 = function(param) {
    var _param = _toArray(param), a = _param.slice(1);
};
var p5 = function(param) {
    var _param = _slicedToArray(param, 1), tmp = _param[0], a = tmp === void 0 ? 1 : tmp;
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
    var _param = _slicedToArray(param, 1), ref = _param[0], value = ref.value, done = ref.done;
};
var MyClass = // Arrow function used in class member initializer
// Arrow function used in class member function
/*#__PURE__*/ function() {
    "use strict";
    function MyClass() {
        var _this = this;
        _classCallCheck(this, MyClass);
        this.m = function(n) {
            return n + 1;
        };
        this.p = function(n) {
            return n && _this;
        };
    }
    _createClass(MyClass, [
        {
            key: "fn",
            value: function fn() {
                var _this = this;
                var m = function(n) {
                    return n + 1;
                };
                var p = function(n) {
                    return n && _this;
                };
            }
        }
    ]);
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
var e1 = arrrr()(3)()(4);
var e1;
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
        return '' + n;
    };
    arr(4).charAt(0);
}
// Arrow function used in nested function in function
function outerFn() {
    var innerFn = function innerFn() {
        var arrowFn = function() {
        };
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
var g = f('')();
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
var h = someOuterFn()('')()();
h.toExponential();
// Arrow function used in try/catch/finally in function
function tryCatchFn() {
    try {
        var _this = this;
        var x = function() {
            return _this;
        };
    } catch (e) {
        var _this1 = this;
        var t = function() {
            return e + _this1;
        };
    } finally{
        var _this2 = this;
        var m = function() {
            return _this2 + '';
        };
    }
}
