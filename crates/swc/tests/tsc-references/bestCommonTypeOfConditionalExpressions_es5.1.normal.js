import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
// conditional expressions return the best common type of the branches plus contextual type (using the first candidate if multiple BCTs exist)
// no errors expected here
var a;
var b;
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
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
var Derived2 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived2, Base);
    var _super = _create_super(Derived2);
    function Derived2() {
        _class_call_check(this, Derived2);
        return _super.apply(this, arguments);
    }
    return Derived2;
}(Base);
var base;
var derived;
var derived2;
var r = true ? 1 : 2;
var r3 = true ? 1 : {};
var r4 = true ? a : b; // typeof a
var r5 = true ? b : a; // typeof b
var r6 = true ? function(x) {} : function(x) {}; // returns number => void
var r7 = true ? function(x) {} : function(x) {};
var r8 = true ? function(x) {} : function(x) {}; // returns Object => void
var r10 = true ? derived : derived2; // no error since we use the contextual type in BCT
var r11 = true ? base : derived2;
function foo5(t, u) {
    return true ? t : u; // BCT is Object
}
