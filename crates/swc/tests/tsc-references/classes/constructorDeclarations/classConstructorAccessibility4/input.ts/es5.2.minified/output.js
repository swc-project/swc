function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
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
var A1 = function() {
    "use strict";
    function A1() {
        _classCallCheck(this, A1);
    }
    return _createClass(A1, [
        {
            key: "method",
            value: function() {
                var B = function() {
                    function B() {
                        _classCallCheck(this, B);
                    }
                    return _createClass(B, [
                        {
                            key: "method",
                            value: function() {
                                new A1();
                            }
                        }
                    ]), B;
                }(), C = function(A) {
                    _inherits(C, A);
                    var _super = _createSuper(C);
                    function C() {
                        return _classCallCheck(this, C), _super.apply(this, arguments);
                    }
                    return C;
                }(A1);
            }
        }
    ]), A1;
}(), D1 = function() {
    "use strict";
    function D1() {
        _classCallCheck(this, D1);
    }
    return _createClass(D1, [
        {
            key: "method",
            value: function() {
                var E = function() {
                    function E() {
                        _classCallCheck(this, E);
                    }
                    return _createClass(E, [
                        {
                            key: "method",
                            value: function() {
                                new D1();
                            }
                        }
                    ]), E;
                }(), F = function(D) {
                    _inherits(F, D);
                    var _super = _createSuper(F);
                    function F() {
                        return _classCallCheck(this, F), _super.apply(this, arguments);
                    }
                    return F;
                }(D1);
            }
        }
    ]), D1;
}();
