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
// @target: es5
function f1() {
    (function(E) {
        E[E["A"] = 0] = "A";
        E[E["B"] = 1] = "B";
        E[E["C"] = 2] = "C";
    })(E || (E = {
    }));
    var C = function C() {
        "use strict";
        _classCallCheck(this, C);
    };
    ;
    var a = [
        new C()
    ];
    a[0].x = E.B;
    return a;
}
function f2() {
    var g = function g() {
        (function(E) {
            E[E["A"] = 0] = "A";
            E[E["B"] = 1] = "B";
            E[E["C"] = 2] = "C";
        })(E || (E = {
        }));
        var C = function C() {
            "use strict";
            _classCallCheck(this, C);
        };
        ;
        var a = [
            new C()
        ];
        a[0].x = E.B;
        return a;
    };
    return g();
}
function f3(b) {
    if (true) {
        (function(E) {
            E[E["A"] = 0] = "A";
            E[E["B"] = 1] = "B";
            E[E["C"] = 2] = "C";
        })(E || (E = {
        }));
        if (b) {
            var C = function C() {
                "use strict";
                _classCallCheck(this, C);
            };
            ;
            var a = [
                new C()
            ];
            a[0].x = E.B;
            return a;
        } else {
            var A = function A() {
                "use strict";
                _classCallCheck(this, A);
            };
            ;
            var c = [
                new A()
            ];
            c[0].x = E.B;
            return c;
        }
    }
}
function f5() {
    var z1 = function z1() {
        (function(E) {
            E[E["A"] = 0] = "A";
            E[E["B"] = 1] = "B";
            E[E["C"] = 2] = "C";
        })(E || (E = {
        }));
        var C = function C() {
            "use strict";
            _classCallCheck(this, C);
        };
        return new C();
    };
    var z2 = function() {
        (function(E) {
            E[E["A"] = 0] = "A";
            E[E["B"] = 1] = "B";
            E[E["C"] = 2] = "C";
        })(E || (E = {
        }));
        var C = function C() {
            "use strict";
            _classCallCheck(this, C);
        };
        return new C();
    };
}
var A1 = /*#__PURE__*/ function() {
    "use strict";
    function A1() {
        _classCallCheck(this, A1);
        var E1;
        (function(E) {
            E[E["A"] = 0] = "A";
            E[E["B"] = 1] = "B";
            E[E["C"] = 2] = "C";
        })(E1 || (E1 = {
        }));
        var C = function C() {
            _classCallCheck(this, C);
        };
    }
    _createClass(A1, [
        {
            key: "m",
            value: function m() {
                (function(E) {
                    E[E["A"] = 0] = "A";
                    E[E["B"] = 1] = "B";
                    E[E["C"] = 2] = "C";
                })(E || (E = {
                }));
                var C = function C() {
                    _classCallCheck(this, C);
                };
                return new C();
            }
        },
        {
            key: "p",
            get: function get() {
                (function(E) {
                    E[E["A"] = 0] = "A";
                    E[E["B"] = 1] = "B";
                    E[E["C"] = 2] = "C";
                })(E || (E = {
                }));
                var C = function C() {
                    _classCallCheck(this, C);
                };
                return new C();
            }
        }
    ]);
    return A1;
}();
function f6() {
    var g = function g() {
        var B = /*#__PURE__*/ function(A) {
            "use strict";
            _inherits(B, A);
            var _super = _createSuper(B);
            function B() {
                _classCallCheck(this, B);
                return _super.apply(this, arguments);
            }
            return B;
        }(A2);
        function h() {
            var C = /*#__PURE__*/ function(B) {
                "use strict";
                _inherits(C, B);
                var _super = _createSuper(C);
                function C() {
                    _classCallCheck(this, C);
                    return _super.apply(this, arguments);
                }
                return C;
            }(B);
            var x = new C();
            x.a = "a";
            x.b = "b";
            x.c = "c";
            return x;
        }
        return h();
    };
    var A2 = function A2() {
        "use strict";
        _classCallCheck(this, A2);
    };
    return g();
}
