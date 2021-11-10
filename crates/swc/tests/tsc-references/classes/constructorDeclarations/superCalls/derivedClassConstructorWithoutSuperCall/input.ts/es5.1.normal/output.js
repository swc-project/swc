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
        var _this;
        return _possibleConstructorReturn(_this);
    }
    return Derived1;
}(Base);
var Base2 = function Base2() {
    "use strict";
    _classCallCheck(this, Base2);
};
var Derived2 = /*#__PURE__*/ function(Base2) {
    "use strict";
    _inherits(Derived2, Base2);
    var _super = _createSuper(Derived2);
    function Derived2() {
        var _this = this;
        _classCallCheck(this, Derived2);
        var _this1;
        var r2 = function() {
            return _this1 = _super.call(_this);
        }; // error for misplaced super call (nested function)
        return _possibleConstructorReturn(_this1);
    }
    return Derived2;
}(Base2);
var Derived3 = /*#__PURE__*/ function(Base2) {
    "use strict";
    _inherits(Derived3, Base2);
    var _super = _createSuper(Derived3);
    function Derived3() {
        _classCallCheck(this, Derived3);
        var _this = this;
        var _this2;
        var r = function r() {
            _this2 = _super.call(_this);
        } // error
        ;
        return _possibleConstructorReturn(_this2);
    }
    return Derived3;
}(Base2);
var Derived4 = /*#__PURE__*/ function(Base2) {
    "use strict";
    _inherits(Derived4, Base2);
    var _super = _createSuper(Derived4);
    function Derived4() {
        _classCallCheck(this, Derived4);
        var _this;
        var r = _this = _super.call(this); // ok
        return _possibleConstructorReturn(_this);
    }
    return Derived4;
}(Base2);
