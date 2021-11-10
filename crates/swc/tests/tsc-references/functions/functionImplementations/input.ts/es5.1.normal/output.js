function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
}
function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assertThisInitialized(self);
}
function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _setPrototypeOf(o, p);
}
var _typeof = function(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
        }));
        return true;
    } catch (e) {
        return false;
    }
}
function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn(this, result);
    };
}
// @allowUnreachableCode: true
// FunctionExpression with no return type annotation and no return statement returns void
var v = function() {
}();
// FunctionExpression f with no return type annotation and directly references f in its body returns any
var a = function f() {
    return f;
};
var a = function f() {
    return f();
};
// FunctionExpression f with no return type annotation and indirectly references f in its body returns any
var a = function f() {
    var x = f;
    return x;
};
// Two mutually recursive function implementations with no return type annotations
function rec1() {
    return rec2();
}
function rec2() {
    return rec1();
}
var a = rec1();
var a = rec2();
// Two mutually recursive function implementations with return type annotation in one
function rec3() {
    return rec4();
}
function rec4() {
    return rec3();
}
var n1;
var n1 = rec3();
var n1 = rec4();
// FunctionExpression with no return type annotation and returns a number
var n1 = function() {
    return 3;
}();
// FunctionExpression with no return type annotation and returns null
var nu = null;
var nu = function() {
    return null;
}();
// FunctionExpression with no return type annotation and returns undefined
var un = undefined;
var un = function() {
    return undefined;
}();
// FunctionExpression with no return type annotation and returns a type parameter type
var n1 = function(x) {
    return x;
}(4);
// FunctionExpression with no return type annotation and returns a constrained type parameter type
var n1 = function(x) {
    return x;
}(4);
// FunctionExpression with no return type annotation with multiple return statements with identical types
var n1 = function() {
    return 3;
    return 5;
}();
var Base = function Base() {
    "use strict";
    _classCallCheck(this, Base);
};
var Derived1 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived1, Base);
    var _super = _createSuper(Derived1);
    function Derived1() {
        _classCallCheck(this, Derived1);
        return _super.apply(this, arguments);
    }
    return Derived1;
}(Base);
var b;
var b = function() {
    return new Base();
    return new Derived1();
}();
// FunctionExpression with no return type annotation with multiple return statements with one a recursive call
var a = function f() {
    return new Base();
    return new Derived1();
    return f(); // ?
}();
// FunctionExpression with non -void return type annotation with a single throw statement
undefined === function() {
    throw undefined;
};
// Type of 'this' in function implementation is 'any'
function thisFunc() {
    var x = this;
    var x;
}
// Function signature with optional parameter, no type annotation and initializer has initializer's type
function opt1(param) {
    var n = param === void 0 ? 4 : param;
    var m = n;
    var m;
}
// Function signature with optional parameter, no type annotation and initializer has initializer's widened type
function opt2(param) {
    var n = param === void 0 ? {
        x: null,
        y: undefined
    } : param;
    var m = n;
    var m;
}
// Function signature with initializer referencing other parameter to the left
function opt3(n, param) {
    var m = param === void 0 ? n : param;
    var y = m;
    var y;
}
// Function signature with optional parameter has correct codegen 
// (tested above)
// FunctionExpression with non -void return type annotation return with no expression
function f6() {
    return;
}
var Derived2 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived2, Base);
    var _super = _createSuper(Derived2);
    function Derived2() {
        _classCallCheck(this, Derived2);
        return _super.apply(this, arguments);
    }
    return Derived2;
}(Base);
var AnotherClass = function AnotherClass() {
    "use strict";
    _classCallCheck(this, AnotherClass);
};
// if f is a contextually typed function expression, the inferred return type is the union type
// of the types of the return statement expressions in the function body, 
// ignoring return statements with no expressions.
var f7 = function(x) {
    if (x < 0) {
        return x;
    }
    return x.toString();
};
var f8 = function(x) {
    return new Base();
    return new Derived2();
};
var f9 = function(x) {
    return new Base();
    return new Derived1();
    return new Derived2();
};
var f10 = function(x) {
    return new Derived1();
    return new Derived2();
};
var f11 = function(x) {
    return new Base();
    return new AnotherClass();
};
var f12 = function(x) {
    return new Base();
    return; // should be ignored
    return new AnotherClass();
};
