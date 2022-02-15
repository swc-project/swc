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
};
function _createSuper(Derived1) {
    var hasNativeReflectConstruct = function() {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;
        try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
        } catch (e) {
            return !1;
        }
    }();
    return function() {
        var result, Super = _getPrototypeOf(Derived1);
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else result = Super.apply(this, arguments);
        return _possibleConstructorReturn(this, result);
    };
}
var Base = function() {
    "use strict";
    _classCallCheck(this, Base);
}, Derived = function(Base1) {
    "use strict";
    function Derived() {
        var _this;
        return _classCallCheck(this, Derived), _possibleConstructorReturn(_this);
    }
    return _inherits(Derived, Base1), _createSuper(Derived), Derived;
}(Base), Base2 = function() {
    "use strict";
    _classCallCheck(this, Base2);
}, Derived2 = function(Base21) {
    "use strict";
    function Derived2() {
        var _this;
        return _classCallCheck(this, Derived2), _possibleConstructorReturn(_this);
    }
    return _inherits(Derived2, Base21), _createSuper(Derived2), Derived2;
}(Base2), Derived3 = function(Base22) {
    "use strict";
    function Derived3() {
        return _classCallCheck(this, Derived3), _possibleConstructorReturn(void 0);
    }
    return _inherits(Derived3, Base22), _createSuper(Derived3), Derived3;
}(Base2), Derived4 = function(Base23) {
    "use strict";
    _inherits(Derived4, Base23);
    var _super = _createSuper(Derived4);
    function Derived4() {
        return _classCallCheck(this, Derived4), _possibleConstructorReturn(_super.call(this));
    }
    return Derived4;
}(Base2);
