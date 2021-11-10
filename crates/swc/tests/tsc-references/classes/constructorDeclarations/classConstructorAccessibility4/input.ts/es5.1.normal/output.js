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
var A1 = // @declaration: true
/*#__PURE__*/ function() {
    "use strict";
    function A1() {
        _classCallCheck(this, A1);
    }
    _createClass(A1, [
        {
            key: "method",
            value: function method() {
                var B = /*#__PURE__*/ function() {
                    function B() {
                        _classCallCheck(this, B);
                    }
                    _createClass(B, [
                        {
                            key: "method",
                            value: function method() {
                                new A1(); // OK
                            }
                        }
                    ]);
                    return B;
                }();
                var C = /*#__PURE__*/ function(A) {
                    _inherits(C, A);
                    var _super = _createSuper(C);
                    function C() {
                        _classCallCheck(this, C);
                        return _super.apply(this, arguments);
                    }
                    return C;
                }(A1);
            }
        }
    ]);
    return A1;
}();
var D1 = /*#__PURE__*/ function() {
    "use strict";
    function D1() {
        _classCallCheck(this, D1);
    }
    _createClass(D1, [
        {
            key: "method",
            value: function method() {
                var E = /*#__PURE__*/ function() {
                    function E() {
                        _classCallCheck(this, E);
                    }
                    _createClass(E, [
                        {
                            key: "method",
                            value: function method() {
                                new D1(); // OK
                            }
                        }
                    ]);
                    return E;
                }();
                var F = /*#__PURE__*/ function(D) {
                    _inherits(F, D);
                    var _super = _createSuper(F);
                    function F() {
                        _classCallCheck(this, F);
                        return _super.apply(this, arguments);
                    }
                    return F;
                }(D1);
            }
        }
    ]);
    return D1;
}();
