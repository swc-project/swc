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
var explicitCFunction, explicitPropertyFunction, _this = this, _this1 = this, _this2 = this, _this3 = this, B = function() {
    "use strict";
    _classCallCheck(this, B);
}, C = function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    return _createClass(C, [
        {
            key: "explicitThis",
            value: function(m) {
                return this.n + m;
            }
        },
        {
            key: "explicitC",
            value: function(m) {
                return this.n + m;
            }
        },
        {
            key: "explicitProperty",
            value: function(m) {
                return this.n + m;
            }
        },
        {
            key: "explicitVoid",
            value: function(m) {
                return m + 1;
            }
        }
    ]), C;
}(), D = function(C) {
    "use strict";
    _inherits(D, C);
    var _super = _createSuper(D);
    function D() {
        return _classCallCheck(this, D), _super.apply(this, arguments);
    }
    return D;
}(C);
function implicitThis(n) {
    return this.m + n + 12;
}
var impl = {
    a: 12,
    explicitVoid2: function() {
        return _this.a;
    },
    explicitVoid1: function() {
        return 12;
    },
    explicitStructural: function() {
        return this.a;
    },
    explicitInterface: function() {
        return this.a;
    },
    explicitThis: function() {
        return this.a;
    }
};
impl.explicitVoid1 = function() {
    return 12;
}, impl.explicitVoid2 = function() {
    return 12;
}, impl.explicitStructural = function() {
    return this.a;
}, impl.explicitInterface = function() {
    return this.a;
}, impl.explicitStructural = function() {
    return 12;
}, impl.explicitInterface = function() {
    return 12;
}, impl.explicitThis = function() {
    return this.a;
}, ({
    y: 12,
    f: function(x) {
        return x + this.y;
    }
}).f(13), implicitThis(12), ({
    notSpecified: 12,
    f: implicitThis
}).f(12);
var c = new C(), d = new D();
c.explicitC, c.explicitC(12), c.explicitProperty(12), c.explicitThis(12), d.explicitC(12), d.explicitProperty(12), d.explicitThis(12);
var reconstructed = {
    n: 12,
    explicitThis: c.explicitThis,
    explicitC: c.explicitC,
    explicitProperty: c.explicitProperty,
    explicitVoid: c.explicitVoid
};
reconstructed.explicitThis(10), reconstructed.explicitProperty(11), (0, reconstructed.explicitVoid)(12), c.explicitC = explicitCFunction, c.explicitC = function(m) {
    return this.n + m;
}, c.explicitProperty = explicitPropertyFunction, c.explicitProperty = function(m) {
    return this.n + m;
}, c.explicitProperty = reconstructed.explicitProperty, c.explicitC = function(m) {
    return m;
}, c.explicitThis = function(m) {
    return m;
}, c.explicitProperty = function(m) {
    return m;
}, c.explicitC = function(m) {
    return m + _this1.n;
}, c.explicitThis = function(m) {
    return m + _this2.n;
}, c.explicitProperty = function(m) {
    return m + _this3.n;
}, c.explicitThis = explicitCFunction, c.explicitThis = function(m) {
    return this.n + m;
}, c.explicitC = function(m) {
    return this.n + m;
}, c.explicitProperty = function(m) {
    return this.n + m;
}, c.explicitThis = function(m) {
    return this.n + m;
}, c.explicitThis = function(m) {
    return this.n + m;
}, c.explicitC = function(m) {
    return this.n + m;
}, c.explicitVoid = function(n) {
    return n;
};
var Base1 = function() {
    "use strict";
    function Base1() {
        _classCallCheck(this, Base1);
    }
    return _createClass(Base1, [
        {
            key: "polymorphic",
            value: function() {
                return this.x;
            }
        },
        {
            key: "explicit",
            value: function() {
                return this.x;
            }
        }
    ], [
        {
            key: "explicitStatic",
            value: function() {
                return this.y;
            }
        }
    ]), Base1;
}(), Derived1 = function(Base1) {
    "use strict";
    _inherits(Derived1, Base1);
    var _super = _createSuper(Derived1);
    function Derived1() {
        return _classCallCheck(this, Derived1), _super.apply(this, arguments);
    }
    return Derived1;
}(Base1), Base2 = function() {
    "use strict";
    function Base2() {
        _classCallCheck(this, Base2);
    }
    return _createClass(Base2, [
        {
            key: "polymorphic",
            value: function() {
                return this.y;
            }
        },
        {
            key: "explicit",
            value: function() {
                return this.x;
            }
        }
    ]), Base2;
}(), Derived2 = function(Base2) {
    "use strict";
    _inherits(Derived2, Base2);
    var _super = _createSuper(Derived2);
    function Derived2() {
        return _classCallCheck(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2;
}(Base2), b1 = new Base1(), b2 = new Base2(), d1 = new Derived1(), d2 = new Derived2();
d2.polymorphic = d1.polymorphic, d1.polymorphic = d2.polymorphic, d1.polymorphic = b2.polymorphic, d2.polymorphic = d1.explicit, b1.polymorphic = d2.polymorphic, b1.explicit = d2.polymorphic, new function() {
    this.a = 12;
}(), new function() {
    this.x = "ok";
}(), new function() {
    this.x = "ok";
}(), f.call(12);
