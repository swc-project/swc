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
var A1 = function(x) {
    "use strict";
    _classCallCheck(this, A1), this.x = x, this.x = 0;
}, B = function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _createSuper(B);
    function B(x) {
        var _this;
        return _classCallCheck(this, B), (_this = _super.call(this, x)).x = 1, _this;
    }
    return B;
}(A1), C = function(A) {
    "use strict";
    _inherits(C, A);
    var _super = _createSuper(C);
    function C(x) {
        var _this;
        return _classCallCheck(this, C), (_this = _super.call(this, x)).x = x, _this.x = 1, _this;
    }
    return C;
}(A1), D1 = function(x) {
    "use strict";
    _classCallCheck(this, D1), this.x = x, this.x = 0;
}, E = function(D) {
    "use strict";
    _inherits(E, D);
    var _super = _createSuper(E);
    function E(x) {
        var _this;
        return _classCallCheck(this, E), (_this = _super.call(this, x)).x = x, _this.x = 1, _this;
    }
    return E;
}(D1);
