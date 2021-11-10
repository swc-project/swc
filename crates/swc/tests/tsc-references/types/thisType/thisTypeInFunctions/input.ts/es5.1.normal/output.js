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
var _this = this, _this1 = this, _this2 = this, _this3 = this, _this4 = this;
var B = function B() {
    "use strict";
    _classCallCheck(this, B);
};
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    _createClass(C, [
        {
            key: "explicitThis",
            value: function explicitThis(m) {
                return this.n + m;
            }
        },
        {
            key: "explicitC",
            value: function explicitC(m) {
                return this.n + m;
            }
        },
        {
            key: "explicitProperty",
            value: function explicitProperty(m) {
                return this.n + m;
            }
        },
        {
            key: "explicitVoid",
            value: function explicitVoid(m) {
                return m + 1;
            }
        }
    ]);
    return C;
}();
var D = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(D, C);
    var _super = _createSuper(D);
    function D() {
        _classCallCheck(this, D);
        return _super.apply(this, arguments);
    }
    return D;
}(C);
function explicitStructural(x) {
    return x + this.y;
}
function justThis() {
    return this.y;
}
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
};
impl.explicitVoid2 = function() {
    return 12;
};
impl.explicitStructural = function() {
    return this.a;
};
impl.explicitInterface = function() {
    return this.a;
};
impl.explicitStructural = function() {
    return 12;
};
impl.explicitInterface = function() {
    return 12;
};
impl.explicitThis = function() {
    return this.a;
};
// parameter checking
var ok = {
    y: 12,
    f: explicitStructural
};
var implicitAnyOk = {
    notSpecified: 12,
    f: implicitThis
};
ok.f(13);
implicitThis(12);
implicitAnyOk.f(12);
var c = new C();
var d = new D();
var ripped = c.explicitC;
c.explicitC(12);
c.explicitProperty(12);
c.explicitThis(12);
d.explicitC(12);
d.explicitProperty(12);
d.explicitThis(12);
var reconstructed = {
    n: 12,
    explicitThis: c.explicitThis,
    explicitC: c.explicitC,
    explicitProperty: c.explicitProperty,
    explicitVoid: c.explicitVoid
};
reconstructed.explicitThis(10);
reconstructed.explicitProperty(11);
var explicitVoid = reconstructed.explicitVoid;
explicitVoid(12);
// assignment checking
var unboundToSpecified = function(x) {
    return x + _this1.y;
}; // ok, this:any
var specifiedToSpecified = explicitStructural;
var anyToSpecified = function anyToSpecified(x) {
    return x + 12;
};
var unspecifiedLambda = function(x) {
    return x + 12;
};
var specifiedLambda = function(x) {
    return x + 12;
};
var unspecifiedLambdaToSpecified = unspecifiedLambda;
var specifiedLambdaToSpecified = specifiedLambda;
var explicitCFunction;
var explicitPropertyFunction;
c.explicitC = explicitCFunction;
c.explicitC = function(m) {
    return this.n + m;
};
c.explicitProperty = explicitPropertyFunction;
c.explicitProperty = function(m) {
    return this.n + m;
};
c.explicitProperty = reconstructed.explicitProperty;
// lambdas are assignable to anything
c.explicitC = function(m) {
    return m;
};
c.explicitThis = function(m) {
    return m;
};
c.explicitProperty = function(m) {
    return m;
};
// this inside lambdas refer to outer scope
// the outer-scoped lambda at top-level is still just `any`
c.explicitC = function(m) {
    return m + _this2.n;
};
c.explicitThis = function(m) {
    return m + _this3.n;
};
c.explicitProperty = function(m) {
    return m + _this4.n;
};
//NOTE: this=C here, I guess?
c.explicitThis = explicitCFunction;
c.explicitThis = function(m) {
    return this.n + m;
};
// this:any compatibility
c.explicitC = function(m) {
    return this.n + m;
};
c.explicitProperty = function(m) {
    return this.n + m;
};
c.explicitThis = function(m) {
    return this.n + m;
};
// this: contextual typing
c.explicitThis = function(m) {
    return this.n + m;
};
// this: superclass compatibility
c.explicitC = function(m) {
    return this.n + m;
};
// this:void compatibility
c.explicitVoid = function(n) {
    return n;
};
var Base1 = // class-based assignability
/*#__PURE__*/ function() {
    "use strict";
    function Base1() {
        _classCallCheck(this, Base1);
    }
    _createClass(Base1, [
        {
            key: "polymorphic",
            value: function polymorphic() {
                return this.x;
            }
        },
        {
            key: "explicit",
            value: function explicit() {
                return this.x;
            }
        }
    ], [
        {
            key: "explicitStatic",
            value: function explicitStatic() {
                return this.y;
            }
        }
    ]);
    return Base1;
}();
var Derived1 = /*#__PURE__*/ function(Base1) {
    "use strict";
    _inherits(Derived1, Base1);
    var _super = _createSuper(Derived1);
    function Derived1() {
        _classCallCheck(this, Derived1);
        return _super.apply(this, arguments);
    }
    return Derived1;
}(Base1);
var Base2 = /*#__PURE__*/ function() {
    "use strict";
    function Base2() {
        _classCallCheck(this, Base2);
    }
    _createClass(Base2, [
        {
            key: "polymorphic",
            value: function polymorphic() {
                return this.y;
            }
        },
        {
            key: "explicit",
            value: function explicit() {
                return this.x;
            }
        }
    ]);
    return Base2;
}();
var Derived2 = /*#__PURE__*/ function(Base2) {
    "use strict";
    _inherits(Derived2, Base2);
    var _super = _createSuper(Derived2);
    function Derived2() {
        _classCallCheck(this, Derived2);
        return _super.apply(this, arguments);
    }
    return Derived2;
}(Base2);
var b1 = new Base1();
var b2 = new Base2();
var d1 = new Derived1();
var d2 = new Derived2();
d2.polymorphic = d1.polymorphic // ok, 'x' and 'y' in { x, y }
;
d1.polymorphic = d2.polymorphic // ok, 'x' and 'y' in { x, y }
;
// bivariance-allowed cases
d1.polymorphic = b2.polymorphic // ok, 'y' in D: { x, y }
;
d2.polymorphic = d1.explicit // ok, 'y' in { x, y }
;
b1.polymorphic = d2.polymorphic // ok, 'x' and 'y' not in Base1: { x }
;
b1.explicit = d2.polymorphic // ok, 'x' and 'y' not in Base1: { x }
;
////// use this-type for construction with new ////
function InterfaceThis() {
    this.a = 12;
}
function LiteralTypeThis() {
    this.x = "ok";
}
function AnyThis() {
    this.x = "ok";
}
var interfaceThis = new InterfaceThis();
var literalTypeThis = new LiteralTypeThis();
var anyThis = new AnyThis();
var n1 = f.call(12);
function missingTypeIsImplicitAny(a) {
    return this.anything + a;
}
