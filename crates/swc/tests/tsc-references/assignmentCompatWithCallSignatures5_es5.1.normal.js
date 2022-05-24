import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
// checking assignment compat for function types. No errors in this file
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
var Derived2 = /*#__PURE__*/ function(Derived) {
    "use strict";
    _inherits(Derived2, Derived);
    var _super = _create_super(Derived2);
    function Derived2() {
        _class_call_check(this, Derived2);
        return _super.apply(this, arguments);
    }
    return Derived2;
}(Derived);
var OtherDerived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(OtherDerived, Base);
    var _super = _create_super(OtherDerived);
    function OtherDerived() {
        _class_call_check(this, OtherDerived);
        return _super.apply(this, arguments);
    }
    return OtherDerived;
}(Base);
var a;
var a2;
var a3;
var a4;
var a5;
var a6;
var a11;
var a15;
var a16;
var a17;
var a18;
var b;
a = b; // ok
b = a; // ok
var b2;
a2 = b2; // ok
b2 = a2; // ok
var b3;
a3 = b3; // ok
b3 = a3; // ok
var b4;
a4 = b4; // ok
b4 = a4; // ok
var b5;
a5 = b5; // ok
b5 = a5; // ok
var b6;
a6 = b6; // ok
b6 = a6; // ok
var b11;
a11 = b11; // ok
b11 = a11; // ok
var b15;
a15 = b15; // ok, T = U, T = V
b15 = a15; // ok
var b16;
a15 = b16; // ok
b15 = a16; // ok
var b17;
a17 = b17; // ok
b17 = a17; // ok
var b18;
a18 = b18; // ok
b18 = a18; // ok
