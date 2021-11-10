function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _getPrototypeOf(o) {
    return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    }, _getPrototypeOf(o);
}
function _instanceof(left, right) {
    return null != right && "undefined" != typeof Symbol && right[Symbol.hasInstance] ? right[Symbol.hasInstance](left) : left instanceof right;
}
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
var ctor1, ctor2, ctor3, ctor4, ctor5, ctor6, C11 = function() {
    "use strict";
    _classCallCheck(this, C11);
}, C2 = function() {
    "use strict";
    _classCallCheck(this, C2);
}, D1 = function(C1) {
    "use strict";
    !function(subClass, superClass) {
        if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                writable: !0,
                configurable: !0
            }
        }), superClass && _setPrototypeOf(subClass, superClass);
    }(D1, C1);
    var _super = function(Derived) {
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
    }(D1);
    function D1() {
        return _classCallCheck(this, D1), _super.apply(this, arguments);
    }
    return D1;
}(C11), C3 = function() {
    "use strict";
    _classCallCheck(this, C3);
};
_instanceof(ctor1, C11) && ctor1.p1, _instanceof(ctor1, C2) && ctor1.p2, _instanceof(ctor1, D1) && ctor1.p1, _instanceof(ctor1, D1) && ctor1.p3, _instanceof(ctor2, C2) && ctor2.p2, _instanceof(ctor2, D1) && ctor2.p3, _instanceof(ctor2, D1) && ctor2.p1, _instanceof(ctor2, C11), _instanceof(ctor3, C11) ? ctor3.p1 : ctor3.p2, _instanceof(ctor4, C11) ? ctor4.p1 : _instanceof(ctor4, C2) ? ctor4.p2 : ctor4.p4, _instanceof(ctor5, C11) ? ctor5.p1 : ctor5.p2, _instanceof(ctor6, C11) || _instanceof(ctor6, C2) || ctor6.p4;
