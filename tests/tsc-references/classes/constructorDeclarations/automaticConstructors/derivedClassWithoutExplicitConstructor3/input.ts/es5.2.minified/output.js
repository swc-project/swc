function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _getPrototypeOf(o) {
    return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    }, _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
    if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: !0,
            configurable: !0
        }
    }), superClass && _setPrototypeOf(subClass, superClass);
}
function _possibleConstructorReturn(self, call) {
    return call && ("object" === _typeof(call) || "function" == typeof call) ? call : (function(self) {
        if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return self;
    })(self);
}
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
var _typeof = function(obj) {
    return obj && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
}, Base = function(x) {
    "use strict";
    _classCallCheck(this, Base), this.a = 1, this.a = x;
}, Derived = function(Base) {
    "use strict";
    function Derived(y, z) {
        var _this;
        return _classCallCheck(this, Derived), (_this = _possibleConstructorReturn(this, _getPrototypeOf(Derived).call(this, 2))).b = "", _this.b = y, _this;
    }
    return _inherits(Derived, Base), Derived;
}(Base), Derived2 = function(Derived) {
    "use strict";
    function Derived2() {
        var _this;
        return _classCallCheck(this, Derived2), _this = _possibleConstructorReturn(this, _getPrototypeOf(Derived2).apply(this, arguments)), _this.x = 1, _this.y = "hello", _this;
    }
    return _inherits(Derived2, Derived), Derived2;
}(Derived);
new Derived(), new Derived2(1), new Derived("", "");
var Base2 = function(x) {
    "use strict";
    _classCallCheck(this, Base2), this.a = x;
}, D = function(Base) {
    "use strict";
    function D(y, z) {
        var _this;
        return _classCallCheck(this, D), (_this = _possibleConstructorReturn(this, _getPrototypeOf(D).call(this, 2))).b = null, _this.b = y, _this;
    }
    return _inherits(D, Base), D;
}(Base), D2 = function(D) {
    "use strict";
    function D2() {
        var _this;
        return _classCallCheck(this, D2), _this = _possibleConstructorReturn(this, _getPrototypeOf(D2).apply(this, arguments)), _this.x = 2, _this.y = null, _this;
    }
    return _inherits(D2, D), D2;
}(D);
new D2(), new D2(new Date()), new D2(new Date(), new Date());
