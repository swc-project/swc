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
function _createSuper(Derived1) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived1), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn(this, result);
    };
}
var Base = function Base(x) {
    "use strict";
    _classCallCheck(this, Base);
    this.a = 1;
    this.a = x;
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _createSuper(Derived);
    function Derived(y, z) {
        _classCallCheck(this, Derived);
        var _this;
        _this = _super.call(this, 2);
        _this.b = '';
        _this.b = y;
        return _this;
    }
    return Derived;
}(Base);
var Derived2 = /*#__PURE__*/ function(Derived) {
    "use strict";
    _inherits(Derived2, Derived);
    var _super = _createSuper(Derived2);
    function Derived2() {
        _classCallCheck(this, Derived2);
        var _this;
        _this = _super.apply(this, arguments);
        _this.x = 1;
        _this.y = 'hello';
        return _this;
    }
    return Derived2;
}(Derived);
var r = new Derived(); // error
var r2 = new Derived2(1); // error
var r3 = new Derived('', '');
var Base2 = function Base2(x) {
    "use strict";
    _classCallCheck(this, Base2);
    this.a = x;
};
var D = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(D, Base);
    var _super = _createSuper(D);
    function D(y, z) {
        _classCallCheck(this, D);
        var _this;
        _this = _super.call(this, 2);
        _this.b = null;
        _this.b = y;
        return _this;
    }
    return D;
}(Base);
var D2 = /*#__PURE__*/ function(D) {
    "use strict";
    _inherits(D2, D);
    var _super = _createSuper(D2);
    function D2() {
        _classCallCheck(this, D2);
        var _this;
        _this = _super.apply(this, arguments);
        _this.x = 2;
        _this.y = null;
        return _this;
    }
    return D2;
}(D);
var d = new D2(); // error
var d2 = new D2(new Date()); // error
var d3 = new D2(new Date(), new Date()); // ok
