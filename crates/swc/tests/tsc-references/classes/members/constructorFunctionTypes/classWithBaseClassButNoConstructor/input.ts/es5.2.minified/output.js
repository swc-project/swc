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
    _classCallCheck(this, Base1);
}, C = function(Base) {
    "use strict";
    _inherits(C, Base);
    var _super = _createSuper(C);
    function C() {
        return _classCallCheck(this, C), _super.apply(this, arguments);
    }
    return C;
}(Base1);
new C(), new C(1);
var Base21 = function(x) {
    "use strict";
    _classCallCheck(this, Base21);
}, D = function(Base2) {
    "use strict";
    _inherits(D, Base2);
    var _super = _createSuper(D);
    function D() {
        return _classCallCheck(this, D), _super.apply(this, arguments);
    }
    return D;
}(Base21);
new D(), new D(1);
var D2 = function(Base2) {
    "use strict";
    _inherits(D2, Base2);
    var _super = _createSuper(D2);
    function D2() {
        return _classCallCheck(this, D2), _super.apply(this, arguments);
    }
    return D2;
}(Base21);
new D(), new D(1);
var D3 = function(Base2) {
    "use strict";
    _inherits(D3, Base2);
    var _super = _createSuper(D3);
    function D3() {
        return _classCallCheck(this, D3), _super.apply(this, arguments);
    }
    return D3;
}(Base21);
new D(), new D(1);
