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
}(Base), C = function(x) {
    return swcHelpers.classCallCheck(this, C), x;
};
new C('a'), a = i = a, new C('hi'), new i('bye'), new a('hm');
