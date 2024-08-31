//// [comparisonOperatorWithSubtypeObjectOnProperty.ts]
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
var A1 = function A1() {
    "use strict";
    _class_call_check(this, A1);
};
var B1 = function B1() {
    "use strict";
    _class_call_check(this, B1);
};
var A2 = function A2() {
    "use strict";
    _class_call_check(this, A2);
};
var B2 = /*#__PURE__*/ function(A2) {
    "use strict";
    _inherits(B2, A2);
    function B2() {
        _class_call_check(this, B2);
        return _call_super(this, B2, arguments);
    }
    return B2;
}(A2);
var a1;
var a2;
var b1;
var b2;
// operator <
var ra1 = a1 < b1;
var ra2 = a2 < b2;
var ra3 = b1 < a1;
var ra4 = b2 < a2;
// operator >
var rb1 = a1 > b1;
var rb2 = a2 > b2;
var rb3 = b1 > a1;
var rb4 = b2 > a2;
// operator <=
var rc1 = a1 <= b1;
var rc2 = a2 <= b2;
var rc3 = b1 <= a1;
var rc4 = b2 <= a2;
// operator >=
var rd1 = a1 >= b1;
var rd2 = a2 >= b2;
var rd3 = b1 >= a1;
var rd4 = b2 >= a2;
// operator ==
var re1 = a1 == b1;
var re2 = a2 == b2;
var re3 = b1 == a1;
var re4 = b2 == a2;
// operator !=
var rf1 = a1 != b1;
var rf2 = a2 != b2;
var rf3 = b1 != a1;
var rf4 = b2 != a2;
// operator ===
var rg1 = a1 === b1;
var rg2 = a2 === b2;
var rg3 = b1 === a1;
var rg4 = b2 === a2;
// operator !==
var rh1 = a1 !== b1;
var rh2 = a2 !== b2;
var rh3 = b1 !== a1;
var rh4 = b2 !== a2;
