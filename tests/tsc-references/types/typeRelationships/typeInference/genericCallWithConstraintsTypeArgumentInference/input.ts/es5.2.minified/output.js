function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
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
function _possibleConstructorReturn(self, call) {
    return call && ("object" === _typeof(call) || "function" == typeof call) ? call : (function(self) {
        if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return self;
    })(self);
}
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
var b, d1, d2, i1, _typeof = function(obj) {
    return obj && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
}, Base1 = function() {
    "use strict";
    _classCallCheck(this, Base1);
}, Derived = function(Base) {
    "use strict";
    function Derived() {
        return _classCallCheck(this, Derived), _possibleConstructorReturn(this, _getPrototypeOf(Derived).apply(this, arguments));
    }
    return _inherits(Derived, Base), Derived;
}(Base1), Derived2 = function(Derived) {
    "use strict";
    function Derived2() {
        return _classCallCheck(this, Derived2), _possibleConstructorReturn(this, _getPrototypeOf(Derived2).apply(this, arguments));
    }
    return _inherits(Derived2, Derived), Derived2;
}(Derived);
function foo(t) {
    return t;
}
foo(b), foo(d1);
var C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C(t, u) {
        _classCallCheck(this, C), this.t = t, this.u = u;
    }
    return Constructor = C, protoProps = [
        {
            key: "foo",
            value: function(t, u) {
                return t;
            }
        },
        {
            key: "foo2",
            value: function(t, u) {
                return u;
            }
        },
        {
            key: "foo3",
            value: function(t, u) {
                return t;
            }
        },
        {
            key: "foo4",
            value: function(t, u) {
                return t;
            }
        },
        {
            key: "foo5",
            value: function(t, u) {
                return t;
            }
        },
        {
            key: "foo6",
            value: function() {
            }
        },
        {
            key: "foo7",
            value: function(u) {
            }
        },
        {
            key: "foo8",
            value: function() {
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}(), c = new C(b, d1);
c.foo(d1, d2), c.foo2(b, d2), c.foo3(d1, d1), c.foo4(d1, d2), c.foo5(d1, d2), c.foo5(d2, d2), c.foo6(), c.foo7(d1), c.foo8(), i1.foo(d1, d2), i1.foo2(b, d2), i1.foo3(d1, d1), i1.foo4(d1, d2), i1.foo5(d1, d2), i1.foo5(d2, d2), i1.foo6(), i1.foo7(d1), i1.foo8();
