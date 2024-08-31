//// [assignmentCompatWithConstructSignatures6.ts]
// checking assignment compatibility relations for function types. All valid.
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
var x;
var b;
x.a = b;
b = x.a;
var b2;
x.a2 = b2;
b2 = x.a2;
var b3;
x.a3 = b3;
b3 = x.a3;
var b4;
x.a4 = b4;
b4 = x.a4;
var b5;
x.a5 = b5;
b5 = x.a5;
var b11;
x.a11 = b11;
b11 = x.a11;
var b16;
x.a16 = b16;
b16 = x.a16;
