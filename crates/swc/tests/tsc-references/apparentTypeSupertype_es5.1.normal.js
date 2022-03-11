import * as swcHelpers from "@swc/helpers";
// subtype checks use the apparent type of the target type
// S is a subtype of a type T, and T is a supertype of S, if one of the following is true, where S' denotes the apparent type (section 3.8.1) of S:
var Base = function Base() {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
};
// is String (S) a subtype of U extends String (T)? Would only be true if we used the apparent type of U (T)
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
