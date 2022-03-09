import * as swcHelpers from "@swc/helpers";
// conditional expressions return the best common type of the branches plus contextual type (using the first candidate if multiple BCTs exist)
// these are errors
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
var base;
var derived;
var derived2;
var r2 = true ? 1 : '';
var r9 = true ? derived : derived2;
function foo(t, u) {
    return true ? t : u;
}
function foo2(t, u) {
    return true ? t : u; // Ok because BCT(T, U) = U
}
function foo3(t, u) {
    return true ? t : u;
}
