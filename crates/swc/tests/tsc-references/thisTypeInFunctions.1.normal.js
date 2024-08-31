//// [thisTypeInFunctions.ts]
// body checking
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var _this = this;
var B = function B() {
    "use strict";
    _class_call_check(this, B);
};
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.explicitThis = function explicitThis(m) {
        return this.n + m;
    };
    _proto.explicitC = function explicitC(m) {
        return this.n + m;
    };
    _proto.explicitProperty = function explicitProperty(m) {
        return this.n + m;
    };
    _proto.explicitVoid = function explicitVoid(m) {
        return m + 1;
    };
    return C;
}();
var D = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(D, C);
    function D() {
        _class_call_check(this, D);
        return _call_super(this, D, arguments);
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
    explicitVoid1: function explicitVoid1() {
        return 12;
    },
    explicitStructural: function explicitStructural() {
        return this.a;
    },
    explicitInterface: function explicitInterface() {
        return this.a;
    },
    explicitThis: function explicitThis() {
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
    return x + _this.y;
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
    return m + _this.n;
};
c.explicitThis = function(m) {
    return m + _this.n;
};
c.explicitProperty = function(m) {
    return m + _this.n;
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
// class-based assignability
var Base1 = /*#__PURE__*/ function() {
    "use strict";
    function Base1() {
        _class_call_check(this, Base1);
    }
    var _proto = Base1.prototype;
    _proto.polymorphic = function polymorphic() {
        return this.x;
    };
    _proto.explicit = function explicit() {
        return this.x;
    };
    Base1.explicitStatic = function explicitStatic() {
        return this.y;
    };
    return Base1;
}();
var Derived1 = /*#__PURE__*/ function(Base1) {
    "use strict";
    _inherits(Derived1, Base1);
    function Derived1() {
        _class_call_check(this, Derived1);
        return _call_super(this, Derived1, arguments);
    }
    return Derived1;
}(Base1);
var Base2 = /*#__PURE__*/ function() {
    "use strict";
    function Base2() {
        _class_call_check(this, Base2);
    }
    var _proto = Base2.prototype;
    _proto.polymorphic = function polymorphic() {
        return this.y;
    };
    _proto.explicit = function explicit() {
        return this.x;
    };
    return Base2;
}();
var Derived2 = /*#__PURE__*/ function(Base2) {
    "use strict";
    _inherits(Derived2, Base2);
    function Derived2() {
        _class_call_check(this, Derived2);
        return _call_super(this, Derived2, arguments);
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
var n = f.call(12);
function missingTypeIsImplicitAny(a) {
    return this.anything + a;
}
