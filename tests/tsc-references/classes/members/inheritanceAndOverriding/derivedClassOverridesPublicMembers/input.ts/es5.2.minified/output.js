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
var x, y, d2, _typeof = function(obj) {
    return obj && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
}, Base = function() {
    "use strict";
    function Base(a) {
        _classCallCheck(this, Base);
    }
    return _createClass(Base, [
        {
            key: "b",
            value: function(a) {
            }
        },
        {
            key: "c",
            get: function() {
                return x;
            },
            set: function(v) {
            }
        }
    ], [
        {
            key: "s",
            value: function(a) {
            }
        },
        {
            key: "t",
            get: function() {
                return x;
            },
            set: function(v) {
            }
        }
    ]), Base;
}(), Derived = function(Base) {
    "use strict";
    function Derived(a) {
        return _classCallCheck(this, Derived), _possibleConstructorReturn(this, _getPrototypeOf(Derived).call(this, x));
    }
    return _inherits(Derived, Base), _createClass(Derived, [
        {
            key: "b",
            value: function(a) {
            }
        },
        {
            key: "c",
            get: function() {
                return y;
            },
            set: function(v) {
            }
        }
    ], [
        {
            key: "s",
            value: function(a) {
            }
        },
        {
            key: "t",
            get: function() {
                return y;
            },
            set: function(a) {
            }
        }
    ]), Derived;
}(Base), d = new Derived(y);
d.a, d.b(y), d.c, d.d, d.c = y, Derived.r, Derived.s(y), Derived.t, Derived.u, Derived.t = y;
var Base2 = function() {
    "use strict";
    _classCallCheck(this, Base2);
}, Derived2 = function(Base2) {
    "use strict";
    function Derived2() {
        return _classCallCheck(this, Derived2), _possibleConstructorReturn(this, _getPrototypeOf(Derived2).apply(this, arguments));
    }
    return _inherits(Derived2, Base2), Derived2;
}(Base2);
d2[""], d2[1];
