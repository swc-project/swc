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
var b, d11, d21, d31, d41, Base = function() {
    "use strict";
    function Base() {
        _classCallCheck(this, Base);
    }
    return _createClass(Base, [
        {
            key: "method",
            value: function() {
                var A = function() {
                    function A() {
                        _classCallCheck(this, A);
                    }
                    return _createClass(A, [
                        {
                            key: "methoda",
                            value: function() {
                                var d1, d2, d3, d4;
                                (void 0).x, d1.x, d2.x, d3.x, d4.x;
                            }
                        }
                    ]), A;
                }();
            }
        }
    ]), Base;
}(), Derived1 = function(Base) {
    "use strict";
    _inherits(Derived1, Base);
    var _super = _createSuper(Derived1);
    function Derived1() {
        return _classCallCheck(this, Derived1), _super.apply(this, arguments);
    }
    return _createClass(Derived1, [
        {
            key: "method1",
            value: function() {
                var B = function() {
                    function B() {
                        _classCallCheck(this, B);
                    }
                    return _createClass(B, [
                        {
                            key: "method1b",
                            value: function() {
                                var d1, d2, d3, d4;
                                (void 0).x, d1.x, d2.x, d3.x, d4.x;
                            }
                        }
                    ]), B;
                }();
            }
        }
    ]), Derived1;
}(Base), Derived2 = function(Base) {
    "use strict";
    _inherits(Derived2, Base);
    var _super = _createSuper(Derived2);
    function Derived2() {
        return _classCallCheck(this, Derived2), _super.apply(this, arguments);
    }
    return _createClass(Derived2, [
        {
            key: "method2",
            value: function() {
                var C = function() {
                    function C() {
                        _classCallCheck(this, C);
                    }
                    return _createClass(C, [
                        {
                            key: "method2c",
                            value: function() {
                                var d1, d2, d3, d4;
                                (void 0).x, d1.x, d2.x, d3.x, d4.x;
                            }
                        }
                    ]), C;
                }();
            }
        }
    ]), Derived2;
}(Base), Derived3 = function(Derived1) {
    "use strict";
    _inherits(Derived3, Derived1);
    var _super = _createSuper(Derived3);
    function Derived3() {
        return _classCallCheck(this, Derived3), _super.apply(this, arguments);
    }
    return _createClass(Derived3, [
        {
            key: "method3",
            value: function() {
                var D = function() {
                    function D() {
                        _classCallCheck(this, D);
                    }
                    return _createClass(D, [
                        {
                            key: "method3d",
                            value: function() {
                                var d1, d2, d3, d4;
                                (void 0).x, d1.x, d2.x, d3.x, d4.x;
                            }
                        }
                    ]), D;
                }();
            }
        }
    ]), Derived3;
}(Derived1), Derived4 = function(Derived2) {
    "use strict";
    _inherits(Derived4, Derived2);
    var _super = _createSuper(Derived4);
    function Derived4() {
        return _classCallCheck(this, Derived4), _super.apply(this, arguments);
    }
    return _createClass(Derived4, [
        {
            key: "method4",
            value: function() {
                var E = function() {
                    function E() {
                        _classCallCheck(this, E);
                    }
                    return _createClass(E, [
                        {
                            key: "method4e",
                            value: function() {
                                var d1, d2, d3, d4;
                                (void 0).x, d1.x, d2.x, d3.x, d4.x;
                            }
                        }
                    ]), E;
                }();
            }
        }
    ]), Derived4;
}(Derived2);
b.x, d11.x, d21.x, d31.x, d41.x;
