function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _getPrototypeOf(o) {
    return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    }, _getPrototypeOf(o);
}
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
var B, A, _typeof = function(obj) {
    return obj && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
};
!function(B1) {
    var a = A;
    B1.a = a;
    var D = function(_C) {
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
        }(D, _C);
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
                var self, call, result, Super = _getPrototypeOf(Derived);
                if (hasNativeReflectConstruct) {
                    var NewTarget = _getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else result = Super.apply(this, arguments);
                return self = this, (call = result) && ("object" === _typeof(call) || "function" == typeof call) ? call : (function(self) {
                    if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return self;
                })(self);
            };
        }(D);
        function D() {
            return _classCallCheck(this, D), _super.apply(this, arguments);
        }
        return D;
    }(a.C);
    B1.D = D;
}(B || (B = {
})), (function(A1) {
    var C = function() {
        "use strict";
        _classCallCheck(this, C);
    };
    A1.C = C, A1.b = B;
})(A || (A = {
})), new B.a.C();
