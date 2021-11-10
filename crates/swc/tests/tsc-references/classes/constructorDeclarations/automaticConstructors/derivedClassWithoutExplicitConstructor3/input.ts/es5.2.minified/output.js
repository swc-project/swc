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
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
function _createSuper(Derived) {
    var hasNativeReflectConstruct = function() {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;
        try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
            })), !0;
        } catch (e) {
            return !1;
        }
    }();
    return function() {
        var obj, self, call, result, Super = _getPrototypeOf(Derived);
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else result = Super.apply(this, arguments);
        return self = this, (call = result) && ("object" == ((obj = call) && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj) || "function" == typeof call) ? call : (function(self) {
            if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return self;
        })(self);
    };
}
var Base1 = function(x) {
    "use strict";
    _classCallCheck(this, Base1), this.a = 1, this.a = x;
}, Derived1 = function(Base) {
    "use strict";
    _inherits(Derived1, Base);
    var _super = _createSuper(Derived1);
    function Derived1(y, z) {
        var _this;
        return _classCallCheck(this, Derived1), (_this = _super.call(this, 2)).b = "", _this.b = y, _this;
    }
    return Derived1;
}(Base1), Derived2 = function(Derived) {
    "use strict";
    _inherits(Derived2, Derived);
    var _super = _createSuper(Derived2);
    function Derived2() {
        var _this;
        return _classCallCheck(this, Derived2), _this = _super.apply(this, arguments), _this.x = 1, _this.y = "hello", _this;
    }
    return Derived2;
}(Derived1);
new Derived1(), new Derived2(1), new Derived1("", "");
var Base2 = function(x) {
    "use strict";
    _classCallCheck(this, Base2), this.a = x;
}, D = function(Base) {
    "use strict";
    _inherits(D, Base);
    var _super = _createSuper(D);
    function D(y, z) {
        var _this;
        return _classCallCheck(this, D), (_this = _super.call(this, 2)).b = null, _this.b = y, _this;
    }
    return D;
}(Base1), D2 = function(D) {
    "use strict";
    _inherits(D2, D);
    var _super = _createSuper(D2);
    function D2() {
        var _this;
        return _classCallCheck(this, D2), _this = _super.apply(this, arguments), _this.x = 2, _this.y = null, _this;
    }
    return D2;
}(D);
new D2(), new D2(new Date()), new D2(new Date(), new Date());
