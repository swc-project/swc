import * as swcHelpers from "@swc/helpers";
var explicitCFunction, explicitPropertyFunction, _this = this, B = function() {
    "use strict";
    swcHelpers.classCallCheck(this, B);
}, C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, [
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
    swcHelpers.inherits(D, C);
    var _super = swcHelpers.createSuper(D);
    function D() {
        return swcHelpers.classCallCheck(this, D), _super.apply(this, arguments);
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
var Base1 = function() {
    "use strict";
    function Base1() {
        swcHelpers.classCallCheck(this, Base1);
    }
    return swcHelpers.createClass(Base1, [
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
    swcHelpers.inherits(Derived1, Base1);
    var _super = swcHelpers.createSuper(Derived1);
    function Derived1() {
        return swcHelpers.classCallCheck(this, Derived1), _super.apply(this, arguments);
    }
    return Derived1;
}(Base1), Base2 = function() {
    "use strict";
    function Base2() {
        swcHelpers.classCallCheck(this, Base2);
    }
    return swcHelpers.createClass(Base2, [
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
    swcHelpers.inherits(Derived2, Base2);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2() {
        return swcHelpers.classCallCheck(this, Derived2), _super.apply(this, arguments);
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
