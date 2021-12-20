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
var C1 = function(_super) {
    "use strict";
    _inherits(C1, null);
    var _super1 = _createSuper(C1);
    function C1() {
        return _classCallCheck(this, C1), _super1.apply(this, arguments);
    }
    return C1;
}(null), C2 = function(_super) {
    "use strict";
    _inherits(C2, null);
    var _super2 = _createSuper(C2);
    function C2() {
        return _classCallCheck(this, C2), _super2.apply(this, arguments);
    }
    return C2;
}(null), C3 = function(_super) {
    "use strict";
    _inherits(C3, null);
    var _super3 = _createSuper(C3);
    function C3() {
        var _this;
        return _classCallCheck(this, C3), _this = _super3.apply(this, arguments), _this.x = 1, _this;
    }
    return C3;
}(null), C4 = function(_super) {
    "use strict";
    _inherits(C4, null);
    var _super4 = _createSuper(C4);
    function C4() {
        var _this;
        return _classCallCheck(this, C4), _this = _super4.apply(this, arguments), _this.x = 1, _this;
    }
    return C4;
}(null);
