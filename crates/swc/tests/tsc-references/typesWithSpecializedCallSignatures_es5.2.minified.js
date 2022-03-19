import * as swcHelpers from "@swc/helpers";
var i, a, Base = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
}, Derived1 = function(Base1) {
    "use strict";
    swcHelpers.inherits(Derived1, Base1);
    var _super = swcHelpers.createSuper(Derived1);
    function Derived1() {
        return swcHelpers.classCallCheck(this, Derived1), _super.apply(this, arguments);
    }
    return Derived1;
}(Base), Derived2 = function(Base2) {
    "use strict";
    swcHelpers.inherits(Derived2, Base2);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2() {
        return swcHelpers.classCallCheck(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2;
}(Base), C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return C.prototype.foo = function(x) {
        return x;
    }, C;
}(), c = new C();
c = i, i = c = a, i = a, a = c, a = i, c.foo('hi'), c.foo('bye'), c.foo('hm');
