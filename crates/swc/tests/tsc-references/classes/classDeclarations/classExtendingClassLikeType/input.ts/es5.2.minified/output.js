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
var D0 = function(Base) {
    "use strict";
    _inherits(D0, Base);
    var _super = _createSuper(D0);
    function D0() {
        return _classCallCheck(this, D0), _super.apply(this, arguments);
    }
    return D0;
}(Base), D1 = function(_super) {
    "use strict";
    _inherits(D1, _super);
    var _super1 = _createSuper(D1);
    function D1() {
        var _this;
        return _classCallCheck(this, D1), (_this = _super1.call(this, "abc", "def")).x = "x", _this.y = "y", _this;
    }
    return D1;
}(getBase()), D2 = function(_super) {
    "use strict";
    _inherits(D2, _super);
    var _super2 = _createSuper(D2);
    function D2() {
        var _this;
        return _classCallCheck(this, D2), _this = _super2.call(this, 10), _this = _super2.call(this, 10, 20), _this.x = 1, _this.y = 2, _this;
    }
    return D2;
}(getBase()), D3 = function(_super) {
    "use strict";
    _inherits(D3, _super);
    var _super3 = _createSuper(D3);
    function D3() {
        var _this;
        return _classCallCheck(this, D3), (_this = _super3.call(this, "abc", 42)).x = "x", _this.y = 2, _this;
    }
    return D3;
}(getBase()), D4 = function(_super) {
    "use strict";
    _inherits(D4, _super);
    var _super4 = _createSuper(D4);
    function D4() {
        return _classCallCheck(this, D4), _super4.apply(this, arguments);
    }
    return D4;
}(getBase()), D5 = function(_super) {
    "use strict";
    _inherits(D5, _super);
    var _super5 = _createSuper(D5);
    function D5() {
        return _classCallCheck(this, D5), _super5.apply(this, arguments);
    }
    return D5;
}(getBadBase());
