function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
}
function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assertThisInitialized(self);
}
function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _setPrototypeOf(o, p);
}
var _typeof = function(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
        }));
        return true;
    } catch (e) {
        return false;
    }
}
function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn(this, result);
    };
}
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base() {
        _classCallCheck(this, Base);
    }
    _createClass(Base, [
        {
            key: "method",
            value: function method() {
                var A = /*#__PURE__*/ function() {
                    function A() {
                        _classCallCheck(this, A);
                    }
                    _createClass(A, [
                        {
                            key: "methoda",
                            value: function methoda() {
                                var b;
                                var d1;
                                var d2;
                                var d3;
                                var d4;
                                b.x; // OK, accessed within their declaring class
                                d1.x; // OK, accessed within their declaring class
                                d2.x; // OK, accessed within their declaring class
                                d3.x; // Error, redefined in a subclass, can only be accessed in the declaring class or one of its subclasses
                                d4.x; // OK, accessed within their declaring class
                            }
                        }
                    ]);
                    return A;
                }();
            }
        }
    ]);
    return Base;
}();
var Derived1 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived1, Base);
    var _super = _createSuper(Derived1);
    function Derived1() {
        _classCallCheck(this, Derived1);
        return _super.apply(this, arguments);
    }
    _createClass(Derived1, [
        {
            key: "method1",
            value: function method1() {
                var B = /*#__PURE__*/ function() {
                    function B() {
                        _classCallCheck(this, B);
                    }
                    _createClass(B, [
                        {
                            key: "method1b",
                            value: function method1b() {
                                var b;
                                var d1;
                                var d2;
                                var d3;
                                var d4;
                                b.x; // Error, isn't accessed through an instance of the enclosing class
                                d1.x; // OK, accessed within a class derived from their declaring class, and through an instance of the enclosing class
                                d2.x; // Error, isn't accessed through an instance of the enclosing class
                                d3.x; // Error, redefined in a subclass, can only be accessed in the declaring class or one of its subclasses
                                d4.x; // Error, isn't accessed through an instance of the enclosing class
                            }
                        }
                    ]);
                    return B;
                }();
            }
        }
    ]);
    return Derived1;
}(Base);
var Derived2 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived2, Base);
    var _super = _createSuper(Derived2);
    function Derived2() {
        _classCallCheck(this, Derived2);
        return _super.apply(this, arguments);
    }
    _createClass(Derived2, [
        {
            key: "method2",
            value: function method2() {
                var C = /*#__PURE__*/ function() {
                    function C() {
                        _classCallCheck(this, C);
                    }
                    _createClass(C, [
                        {
                            key: "method2c",
                            value: function method2c() {
                                var b;
                                var d1;
                                var d2;
                                var d3;
                                var d4;
                                b.x; // Error, isn't accessed through an instance of the enclosing class
                                d1.x; // Error, isn't accessed through an instance of the enclosing class
                                d2.x; // OK, accessed within a class derived from their declaring class, and through an instance of the enclosing class
                                d3.x; // Error, redefined in a subclass, can only be accessed in the declaring class or one of its subclasses
                                d4.x; // OK, accessed within a class derived from their declaring class, and through an instance of the enclosing class or one of its subclasses
                            }
                        }
                    ]);
                    return C;
                }();
            }
        }
    ]);
    return Derived2;
}(Base);
var Derived3 = /*#__PURE__*/ function(Derived1) {
    "use strict";
    _inherits(Derived3, Derived1);
    var _super = _createSuper(Derived3);
    function Derived3() {
        _classCallCheck(this, Derived3);
        return _super.apply(this, arguments);
    }
    _createClass(Derived3, [
        {
            key: "method3",
            value: function method3() {
                var D = /*#__PURE__*/ function() {
                    function D() {
                        _classCallCheck(this, D);
                    }
                    _createClass(D, [
                        {
                            key: "method3d",
                            value: function method3d() {
                                var b;
                                var d1;
                                var d2;
                                var d3;
                                var d4;
                                b.x; // Error, isn't accessed through an instance of the enclosing class
                                d1.x; // Error, isn't accessed through an instance of the enclosing class
                                d2.x; // Error, isn't accessed through an instance of the enclosing class
                                d3.x; // OK, accessed within their declaring class
                                d4.x; // Error, isn't accessed through an instance of the enclosing class
                            }
                        }
                    ]);
                    return D;
                }();
            }
        }
    ]);
    return Derived3;
}(Derived1);
var Derived4 = /*#__PURE__*/ function(Derived2) {
    "use strict";
    _inherits(Derived4, Derived2);
    var _super = _createSuper(Derived4);
    function Derived4() {
        _classCallCheck(this, Derived4);
        return _super.apply(this, arguments);
    }
    _createClass(Derived4, [
        {
            key: "method4",
            value: function method4() {
                var E = /*#__PURE__*/ function() {
                    function E() {
                        _classCallCheck(this, E);
                    }
                    _createClass(E, [
                        {
                            key: "method4e",
                            value: function method4e() {
                                var b;
                                var d1;
                                var d2;
                                var d3;
                                var d4;
                                b.x; // Error, isn't accessed through an instance of the enclosing class
                                d1.x; // Error, isn't accessed through an instance of the enclosing class
                                d2.x; // Error, isn't accessed through an instance of the enclosing class
                                d3.x; // Error, redefined in a subclass, can only be accessed in the declaring class or one of its subclasses
                                d4.x; // OK, accessed within a class derived from their declaring class, and through an instance of the enclosing class
                            }
                        }
                    ]);
                    return E;
                }();
            }
        }
    ]);
    return Derived4;
}(Derived2);
var b1;
var d11;
var d21;
var d31;
var d41;
b1.x; // Error, neither within their declaring class nor classes derived from their declaring class
d11.x; // Error, neither within their declaring class nor classes derived from their declaring class
d21.x; // Error, neither within their declaring class nor classes derived from their declaring class
d31.x; // Error, neither within their declaring class nor classes derived from their declaring class
d41.x; // Error, neither within their declaring class nor classes derived from their declaring class
