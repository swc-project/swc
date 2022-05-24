import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
// subtype checks use the apparent type of the target type
// S is a subtype of a type T, and T is a supertype of S, if one of the following is true, where S' denotes the apparent type (section 3.8.1) of S:
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
// is String (S) a subtype of U extends String (T)? Would only be true if we used the apparent type of U (T)
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        _class_call_check(this, Derived);
        return _super.apply(this, arguments);
    }
    return Derived;
}(Base);
var Base2 = function Base2() {
    "use strict";
    _class_call_check(this, Base2);
};
// is U extends String (S) a subtype of String (T)? Apparent type of U is String so it succeeds
var Derived2 = /*#__PURE__*/ function(Base2) {
    "use strict";
    _inherits(Derived2, Base2);
    var _super = _create_super(Derived2);
    function Derived2() {
        _class_call_check(this, Derived2);
        return _super.apply(this, arguments);
    }
    return Derived2;
}(Base2);
