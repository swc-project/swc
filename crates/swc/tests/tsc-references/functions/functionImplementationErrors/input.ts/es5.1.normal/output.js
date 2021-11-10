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
// FunctionExpression with no return type annotation with multiple return statements with unrelated types
var f1 = function f1() {
    return '';
    return 3;
};
var f2 = function x() {
    return '';
    return 3;
};
var f3 = function() {
    return '';
    return 3;
};
// FunctionExpression with no return type annotation with return branch of number[] and other of string[]
var f4 = function f4() {
    if (true) {
        return [
            ''
        ];
    } else {
        return [
            1
        ];
    }
};
// Function implemetnation with non -void return type annotation with no return
function f5() {
}
var m;
// Function signature with parameter initializer referencing in scope local variable
function f6(param) {
    var n = param === void 0 ? m : param;
    var m1 = 4;
}
// Function signature with initializer referencing other parameter to the right
function f7(param, m2) {
    var n = param === void 0 ? m : param;
}
// FunctionExpression with non -void return type annotation with a throw, no return, and other code
// Should be error but isn't
undefined === function() {
    throw undefined;
    var x = 4;
};
var Base = function Base() {
    "use strict";
    _classCallCheck(this, Base);
};
var AnotherClass = function AnotherClass() {
    "use strict";
    _classCallCheck(this, AnotherClass);
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
function f8() {
    return new Derived1();
    return new Derived2();
}
var f9 = function f9() {
    return new Derived1();
    return new Derived2();
};
var f10 = function() {
    return new Derived1();
    return new Derived2();
};
function f11() {
    return new Base();
    return new AnotherClass();
}
var f12 = function f12() {
    return new Base();
    return new AnotherClass();
};
var f13 = function() {
    return new Base();
    return new AnotherClass();
};
