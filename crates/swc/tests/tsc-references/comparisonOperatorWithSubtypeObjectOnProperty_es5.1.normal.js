import * as swcHelpers from "@swc/helpers";
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
var A1 = function A1() {
    "use strict";
    swcHelpers.classCallCheck(this, A1);
};
var B1 = function B1() {
    "use strict";
    swcHelpers.classCallCheck(this, B1);
};
var A2 = function A2() {
    "use strict";
    swcHelpers.classCallCheck(this, A2);
};
var B2 = /*#__PURE__*/ function(A2) {
    "use strict";
    swcHelpers.inherits(B2, A2);
    var _super = swcHelpers.createSuper(B2);
    function B2() {
        swcHelpers.classCallCheck(this, B2);
        return _super.apply(this, arguments);
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
