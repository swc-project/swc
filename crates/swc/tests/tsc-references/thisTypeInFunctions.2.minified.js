//// [thisTypeInFunctions.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var explicitCFunction, explicitPropertyFunction, _this = this, C = /*#__PURE__*/ function() {
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    return _proto.explicitThis = function(m) {
        return this.n + m;
    }, _proto.explicitC = function(m) {
        return this.n + m;
    }, _proto.explicitProperty = function(m) {
        return this.n + m;
    }, _proto.explicitVoid = function(m) {
        return m + 1;
    }, C;
}(), D = /*#__PURE__*/ function(C) {
    function D() {
        return _class_call_check(this, D), _call_super(this, D, arguments);
    }
    return _inherits(D, C), D;
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
    return m + _this.n;
}, c.explicitThis = function(m) {
    return m + _this.n;
}, c.explicitProperty = function(m) {
    return m + _this.n;
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
var Base1 = /*#__PURE__*/ function() {
    function Base1() {
        _class_call_check(this, Base1);
    }
    var _proto = Base1.prototype;
    return _proto.polymorphic = function() {
        return this.x;
    }, _proto.explicit = function() {
        return this.x;
    }, Base1.explicitStatic = function() {
        return this.y;
    }, Base1;
}(), Derived1 = /*#__PURE__*/ function(Base1) {
    function Derived1() {
        return _class_call_check(this, Derived1), _call_super(this, Derived1, arguments);
    }
    return _inherits(Derived1, Base1), Derived1;
}(Base1), Base2 = /*#__PURE__*/ function() {
    function Base2() {
        _class_call_check(this, Base2);
    }
    var _proto = Base2.prototype;
    return _proto.polymorphic = function() {
        return this.y;
    }, _proto.explicit = function() {
        return this.x;
    }, Base2;
}(), Derived2 = /*#__PURE__*/ function(Base2) {
    function Derived2() {
        return _class_call_check(this, Derived2), _call_super(this, Derived2, arguments);
    }
    return _inherits(Derived2, Base2), Derived2;
}(Base2), b1 = new Base1(), b2 = new Base2(), d1 = new Derived1(), d2 = new Derived2();
d2.polymorphic = d1.polymorphic, d1.polymorphic = d2.polymorphic, d1.polymorphic = b2.polymorphic, d2.polymorphic = d1.explicit, b1.polymorphic = d2.polymorphic, b1.explicit = d2.polymorphic, new function() {
    this.a = 12;
}(), new function() {
    this.x = "ok";
}(), new function() {
    this.x = "ok";
}(), f.call(12);
