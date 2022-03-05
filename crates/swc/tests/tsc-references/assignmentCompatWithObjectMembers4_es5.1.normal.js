import * as swcHelpers from "@swc/helpers";
// members N and M of types S and T have the same name, same accessibility, same optionality, and N is not assignable M
var OnlyDerived;
(function(OnlyDerived) {
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
    var Derived2 = /*#__PURE__*/ function(Base) {
        "use strict";
        swcHelpers.inherits(Derived2, Base);
        var _super = swcHelpers.createSuper(Derived2);
        function Derived2() {
            swcHelpers.classCallCheck(this, Derived2);
            return _super.apply(this, arguments);
        }
        return Derived2;
    }(Base);
    var S = function S() {
        "use strict";
        swcHelpers.classCallCheck(this, S);
    };
    var T = function T() {
        "use strict";
        swcHelpers.classCallCheck(this, T);
    };
    var s;
    var t;
    var s2;
    var t2;
    var a;
    var b;
    var a2 = {
        foo: new Derived()
    };
    var b2 = {
        foo: new Derived2()
    };
    s = t; // error
    t = s; // error
    s = s2; // ok
    s = a2; // ok
    s2 = t2; // error
    t2 = s2; // error
    s2 = t; // error
    s2 = b; // error
    s2 = a2; // ok
    a = b; // error
    b = a; // error
    a = s; // ok
    a = s2; // ok
    a = a2; // ok
    a2 = b2; // error
    b2 = a2; // error
    a2 = b; // error
    a2 = t2; // error
    a2 = t; // error
})(OnlyDerived || (OnlyDerived = {}));
var WithBase;
(function(WithBase) {
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
    var Derived2 = /*#__PURE__*/ function(Base) {
        "use strict";
        swcHelpers.inherits(Derived2, Base);
        var _super = swcHelpers.createSuper(Derived2);
        function Derived2() {
            swcHelpers.classCallCheck(this, Derived2);
            return _super.apply(this, arguments);
        }
        return Derived2;
    }(Base);
    var S = function S() {
        "use strict";
        swcHelpers.classCallCheck(this, S);
    };
    var T = function T() {
        "use strict";
        swcHelpers.classCallCheck(this, T);
    };
    var s;
    var t;
    var s2;
    var t2;
    var a;
    var b;
    var a2 = {
        foo: new Base()
    };
    var b2 = {
        foo: new Derived2()
    };
    s = t; // ok
    t = s; // error
    s = s2; // ok
    s = a2; // ok
    s2 = t2; // ok
    t2 = s2; // error
    s2 = t; // ok
    s2 = b; // ok
    s2 = a2; // ok
    a = b; // ok
    b = a; // error
    a = s; // ok
    a = s2; // ok
    a = a2; // ok
    a2 = b2; // ok
    b2 = a2; // error
    a2 = b; // ok
    a2 = t2; // ok
    a2 = t; // ok
})(WithBase || (WithBase = {}));
