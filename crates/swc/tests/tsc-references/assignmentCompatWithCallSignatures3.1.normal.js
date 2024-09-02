//// [assignmentCompatWithCallSignatures3.ts]
// these are all permitted with the current rules, since we do not do contextual signature instantiation
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    function Derived() {
        _class_call_check(this, Derived);
        return _call_super(this, Derived, arguments);
    }
    return Derived;
}(Base);
var Derived2 = /*#__PURE__*/ function(Derived) {
    "use strict";
    _inherits(Derived2, Derived);
    function Derived2() {
        _class_call_check(this, Derived2);
        return _call_super(this, Derived2, arguments);
    }
    return Derived2;
}(Derived);
var OtherDerived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(OtherDerived, Base);
    function OtherDerived() {
        _class_call_check(this, OtherDerived);
        return _call_super(this, OtherDerived, arguments);
    }
    return OtherDerived;
}(Base);
var a;
var a2;
var a3;
var a4;
var a5;
var a6;
var a7;
var a8;
var a9;
var a10;
var a11;
var a12;
var a13;
var a14;
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
var b7;
a7 = b7; // ok
b7 = a7; // ok
var b8;
a8 = b8; // ok
b8 = a8; // ok
var b9;
a9 = b9; // ok
b9 = a9; // ok
var b10;
a10 = b10; // ok
b10 = a10; // ok
var b11;
a11 = b11; // ok
b11 = a11; // ok
var b12;
a12 = b12; // ok
b12 = a12; // ok
var b13;
a13 = b13; // ok
b13 = a13; // ok
var b14;
a14 = b14; // ok
b14 = a14; // ok
var b15;
a15 = b15; // ok
b15 = a15; // ok
var b16;
a16 = b16; // ok
b16 = a16; // ok
var b17; // ok
a17 = b17; // ok
b17 = a17; // ok
var b18;
a18 = b18; // ok
b18 = a18; // ok
