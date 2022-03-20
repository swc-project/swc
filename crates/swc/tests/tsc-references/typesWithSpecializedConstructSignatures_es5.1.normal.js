import * as swcHelpers from "@swc/helpers";
// basic uses of specialized signatures without errors
var Base = function Base() {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
};
var Derived1 = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived1, Base);
    var _super = swcHelpers.createSuper(Derived1);
    function Derived1() {
        swcHelpers.classCallCheck(this, Derived1);
        return _super.apply(this, arguments);
    }
    return Derived1;
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
var C = function C(x) {
    "use strict";
    swcHelpers.classCallCheck(this, C);
    return x;
};
var c = new C("a");
var i;
var a;
c = i;
c = a;
i = a;
a = i;
var r1 = new C("hi");
var r2 = new i("bye");
var r3 = new a("hm");
