import * as swcHelpers from "@swc/helpers";
var b, d1, d2, i, Base = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
}, Derived = function(Base1) {
    "use strict";
    swcHelpers.inherits(Derived, Base1);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        return swcHelpers.classCallCheck(this, Derived), _super.apply(this, arguments);
    }
    return Derived;
}(Base), Derived2 = function(Derived) {
    "use strict";
    swcHelpers.inherits(Derived2, Derived);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2() {
        return swcHelpers.classCallCheck(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2;
}(Derived), C = function() {
    "use strict";
    function C(t, u) {
        swcHelpers.classCallCheck(this, C), this.t = t, this.u = u;
    }
    var _proto = C.prototype;
    return _proto.foo = function(t, u) {
        return t;
    }, _proto.foo2 = function(t, u) {
        return u;
    }, _proto.foo3 = function(t, u) {
        return t;
    }, _proto.foo4 = function(t, u) {
        return t;
    }, _proto.foo5 = function(t, u) {
        return t;
    }, _proto.foo6 = function() {}, _proto.foo7 = function(u) {}, _proto.foo8 = function() {}, C;
}(), c = new C(b, d1);
c.foo(d1, d2), c.foo2(b, d2), c.foo3(d1, d1), c.foo4(d1, d2), c.foo5(d1, d2), c.foo5(d2, d2), c.foo6(), c.foo7(d1), c.foo8(), i.foo(d1, d2), i.foo2(b, d2), i.foo3(d1, d1), i.foo4(d1, d2), i.foo5(d1, d2), i.foo5(d2, d2), i.foo6(), i.foo7(d1), i.foo8();
