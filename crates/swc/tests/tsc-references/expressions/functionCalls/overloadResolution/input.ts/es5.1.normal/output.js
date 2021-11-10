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
var SomeBase = function SomeBase() {
    "use strict";
    _classCallCheck(this, SomeBase);
};
var SomeDerived1 = /*#__PURE__*/ function(SomeBase) {
    "use strict";
    _inherits(SomeDerived1, SomeBase);
    var _super = _createSuper(SomeDerived1);
    function SomeDerived1() {
        _classCallCheck(this, SomeDerived1);
        return _super.apply(this, arguments);
    }
    return SomeDerived1;
}(SomeBase);
var SomeDerived2 = /*#__PURE__*/ function(SomeBase) {
    "use strict";
    _inherits(SomeDerived2, SomeBase);
    var _super = _createSuper(SomeDerived2);
    function SomeDerived2() {
        _classCallCheck(this, SomeDerived2);
        return _super.apply(this, arguments);
    }
    return SomeDerived2;
}(SomeBase);
var SomeDerived3 = /*#__PURE__*/ function(SomeBase) {
    "use strict";
    _inherits(SomeDerived3, SomeBase);
    var _super = _createSuper(SomeDerived3);
    function SomeDerived3() {
        _classCallCheck(this, SomeDerived3);
        return _super.apply(this, arguments);
    }
    return SomeDerived3;
}(SomeBase);
function fn1() {
    return null;
}
var s = fn1(undefined);
var s;
// No candidate overloads found
fn1({
}); // Error
function fn2() {
    return undefined;
}
var d = fn2(0, undefined);
var d;
// Generic and non - generic overload where generic overload is the only candidate when called without type arguments
var s = fn2(0, '');
// Generic and non - generic overload where non - generic overload is the only candidate when called with type arguments
fn2('', 0); // Error
// Generic and non - generic overload where non - generic overload is the only candidate when called without type arguments
fn2('', 0); // OK
function fn3() {
    return null;
}
var s = fn3(3);
var s = fn3('', 3, '');
var n1 = fn3(5, 5, 5);
var n1;
// Generic overloads with differing arity called with type arguments matching each overload type parameter count
var s = fn3(4);
var s = fn3('', '', '');
var n1 = fn3('', '', 3);
// Generic overloads with differing arity called with type argument count that doesn't match any overload
fn3(); // Error
function fn4() {
}
fn4('', 3);
fn4(3, ''); // Error
fn4('', 3); // Error
fn4(3, '');
// Generic overloads with constraints called without type arguments but with types that satisfy the constraints
fn4('', 3);
fn4(3, '');
fn4(3, undefined);
fn4('', null);
// Generic overloads with constraints called with type arguments that do not satisfy the constraints
fn4(null, null); // Error
// Generic overloads with constraints called without type arguments but with types that do not satisfy the constraints
fn4(true, null); // Error
fn4(null, true); // Error
function fn5() {
    return undefined;
}
var n1 = fn5(function(n) {
    return n.toFixed();
});
var s = fn5(function(n) {
    return n.substr(0);
});
