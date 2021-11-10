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
var t1, t2, t3, t4, t5, C2 = function() {
    "use strict";
    _classCallCheck(this, C2);
}, D = function() {
    "use strict";
    _classCallCheck(this, D);
}, E = function() {
    "use strict";
    _classCallCheck(this, E);
}, F = function(C) {
    "use strict";
    _inherits(F, C);
    var _super = _createSuper(F);
    function F() {
        return _classCallCheck(this, F), _super.apply(this, arguments);
    }
    return F;
}(C2), C11 = function() {
    "use strict";
    _classCallCheck(this, C11), this.i = "foo";
}, D1 = function(C1) {
    "use strict";
    _inherits(D1, C1);
    var _super = _createSuper(D1);
    function D1() {
        var _this;
        return _classCallCheck(this, D1), _this = _super.apply(this, arguments), _this.i = "bar", _this;
    }
    return D1;
}(C11);
t1[4], t2[4], t3[4], t4[2], t5[2];
