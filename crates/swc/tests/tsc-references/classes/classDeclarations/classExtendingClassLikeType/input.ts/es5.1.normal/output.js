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
var D0 = // Error, no Base constructor function
/*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(D0, Base);
    var _super = _createSuper(D0);
    function D0() {
        _classCallCheck(this, D0);
        return _super.apply(this, arguments);
    }
    return D0;
}(Base);
var D1 = /*#__PURE__*/ function(_super) {
    "use strict";
    _inherits(D1, _super);
    var _super1 = _createSuper(D1);
    function D1() {
        _classCallCheck(this, D1);
        var _this;
        _this = _super1.call(this, "abc", "def");
        _this.x = "x";
        _this.y = "y";
        return _this;
    }
    return D1;
}(getBase());
var D2 = /*#__PURE__*/ function(_super) {
    "use strict";
    _inherits(D2, _super);
    var _super2 = _createSuper(D2);
    function D2() {
        _classCallCheck(this, D2);
        var _this;
        _this = _super2.call(this, 10);
        _this = _super2.call(this, 10, 20);
        _this.x = 1;
        _this.y = 2;
        return _this;
    }
    return D2;
}(getBase());
var D3 = /*#__PURE__*/ function(_super) {
    "use strict";
    _inherits(D3, _super);
    var _super3 = _createSuper(D3);
    function D3() {
        _classCallCheck(this, D3);
        var _this;
        _this = _super3.call(this, "abc", 42);
        _this.x = "x";
        _this.y = 2;
        return _this;
    }
    return D3;
}(getBase());
var D4 = // Error, no constructors with three type arguments
/*#__PURE__*/ function(_super) {
    "use strict";
    _inherits(D4, _super);
    var _super4 = _createSuper(D4);
    function D4() {
        _classCallCheck(this, D4);
        return _super4.apply(this, arguments);
    }
    return D4;
}(getBase());
var D5 = // Error, constructor return types differ
/*#__PURE__*/ function(_super) {
    "use strict";
    _inherits(D5, _super);
    var _super5 = _createSuper(D5);
    function D5() {
        _classCallCheck(this, D5);
        return _super5.apply(this, arguments);
    }
    return D5;
}(getBadBase());
