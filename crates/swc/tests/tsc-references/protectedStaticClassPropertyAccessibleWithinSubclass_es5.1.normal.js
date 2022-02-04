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
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
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
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base() {
        _classCallCheck(this, Base);
    }
    _createClass(Base, null, [
        {
            key: "staticMethod",
            value: function staticMethod() {
                Base.x; // OK, accessed within their declaring class
                Derived1.x; // OK, accessed within their declaring class
                Derived2.x; // OK, accessed within their declaring class
                Derived3.x; // Error, redefined in a subclass, can only be accessed in the declaring class or one of its subclasses
            }
        }
    ]);
    return Base;
}();
var Derived1 = /*#__PURE__*/ function(Base1) {
    "use strict";
    _inherits(Derived1, Base1);
    var _super = _createSuper(Derived1);
    function Derived1() {
        _classCallCheck(this, Derived1);
        return _super.apply(this, arguments);
    }
    _createClass(Derived1, null, [
        {
            key: "staticMethod1",
            value: function staticMethod1() {
                Base.x; // OK, accessed within a class derived from their declaring class
                Derived1.x; // OK, accessed within a class derived from their declaring class
                Derived2.x; // OK, accessed within a class derived from their declaring class
                Derived3.x; // Error, redefined in a subclass, can only be accessed in the declaring class or one of its subclasses
            }
        }
    ]);
    return Derived1;
}(Base);
var Derived2 = /*#__PURE__*/ function(Base2) {
    "use strict";
    _inherits(Derived2, Base2);
    var _super = _createSuper(Derived2);
    function Derived2() {
        _classCallCheck(this, Derived2);
        return _super.apply(this, arguments);
    }
    _createClass(Derived2, null, [
        {
            key: "staticMethod2",
            value: function staticMethod2() {
                Base.x; // OK, accessed within a class derived from their declaring class
                Derived1.x; // OK, accessed within a class derived from their declaring class
                Derived2.x; // OK, accessed within a class derived from their declaring class
                Derived3.x; // Error, redefined in a subclass, can only be accessed in the declaring class or one of its subclasses
            }
        }
    ]);
    return Derived2;
}(Base);
var Derived3 = /*#__PURE__*/ function(Derived11) {
    "use strict";
    _inherits(Derived3, Derived11);
    var _super = _createSuper(Derived3);
    function Derived3() {
        _classCallCheck(this, Derived3);
        return _super.apply(this, arguments);
    }
    _createClass(Derived3, null, [
        {
            key: "staticMethod3",
            value: function staticMethod3() {
                Base.x; // OK, accessed within a class derived from their declaring class
                Derived1.x; // OK, accessed within a class derived from their declaring class
                Derived2.x; // OK, accessed within a class derived from their declaring class
                Derived3.x; // OK, accessed within their declaring class
            }
        }
    ]);
    return Derived3;
}(Derived1);
Base.x; // Error, neither within their declaring class nor classes derived from their declaring class
Derived1.x; // Error, neither within their declaring class nor classes derived from their declaring class
Derived2.x; // Error, neither within their declaring class nor classes derived from their declaring class
Derived3.x; // Error, neither within their declaring class nor classes derived from their declaring class
