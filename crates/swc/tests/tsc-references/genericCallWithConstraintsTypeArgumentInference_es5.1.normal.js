import * as swcHelpers from "@swc/helpers";
var Base = function Base() {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        swcHelpers.classCallCheck(this, Derived);
        return _super.apply(this, arguments);
    }
    return Derived;
}(Base);
var Derived2 = /*#__PURE__*/ function(Derived) {
    "use strict";
    swcHelpers.inherits(Derived2, Derived);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2() {
        swcHelpers.classCallCheck(this, Derived2);
        return _super.apply(this, arguments);
    }
    return Derived2;
}(Derived);
var b;
var d1;
var d2;
function foo(t) {
    return t;
}
var r = foo(b); // Base
var r2 = foo(d1); // Derived
function foo2(t, u) {
    return u;
}
function foo2b(u) {
    var x;
    return x;
}
function foo2c() {
    var x;
    return x;
}
var r3 = foo2b(d1); // Base
var r3b = foo2c(); // Base
var C = /*#__PURE__*/ function() {
    "use strict";
    function C(t, u) {
        swcHelpers.classCallCheck(this, C);
        this.t = t;
        this.u = u;
    }
    swcHelpers.createClass(C, [
        {
            key: "foo",
            value: function foo(t, u) {
                return t;
            }
        },
        {
            key: "foo2",
            value: function foo2(t, u) {
                return u;
            }
        },
        {
            key: "foo3",
            value: function foo3(t, u) {
                return t;
            }
        },
        {
            key: "foo4",
            value: function foo4(t, u) {
                return t;
            }
        },
        {
            key: "foo5",
            value: function foo5(t, u) {
                return t;
            }
        },
        {
            key: "foo6",
            value: function foo6() {
                var x;
                return x;
            }
        },
        {
            key: "foo7",
            value: function foo7(u) {
                var x;
                return x;
            }
        },
        {
            key: "foo8",
            value: function foo8() {
                var x;
                return x;
            }
        }
    ]);
    return C;
}();
var c = new C(b, d1);
var r4 = c.foo(d1, d2); // Base
var r5 = c.foo2(b, d2); // Derived
var r6 = c.foo3(d1, d1); // Derived
var r7 = c.foo4(d1, d2); // Base
var r8 = c.foo5(d1, d2); // Derived
var r8b = c.foo5(d2, d2); // Derived2
var r9 = c.foo6(); // Derived
var r10 = c.foo7(d1); // Base
var r11 = c.foo8(); // Base
var i;
var r4 = i.foo(d1, d2); // Base
var r5 = i.foo2(b, d2); // Derived
var r6 = i.foo3(d1, d1); // Derived
var r7 = i.foo4(d1, d2); // Base
var r8 = i.foo5(d1, d2); // Derived
var r8b = i.foo5(d2, d2); // Derived2
var r9 = i.foo6(); // Derived
var r10 = i.foo7(d1); // Base
var r11 = i.foo8(); // Base
