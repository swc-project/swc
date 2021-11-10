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
var x, y, d2, Base = function() {
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
}(), Derived1 = function(Base) {
    "use strict";
    _inherits(Derived1, Base);
    var _super = _createSuper(Derived1);
    function Derived1(a) {
        return _classCallCheck(this, Derived1), _super.call(this, a);
    }
    return _createClass(Derived1, [
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
    ]), Derived1;
}(Base), d = new Derived1(y);
d.a, d.b(y), d.c, d.d, d.c = y, Derived1.r, Derived1.s(y), Derived1.t, Derived1.u, Derived1.t = y;
var Base21 = function() {
    "use strict";
    _classCallCheck(this, Base21);
}, Derived2 = function(Base2) {
    "use strict";
    _inherits(Derived2, Base2);
    var _super = _createSuper(Derived2);
    function Derived2() {
        return _classCallCheck(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2;
}(Base21);
d2[""], d2[1];
