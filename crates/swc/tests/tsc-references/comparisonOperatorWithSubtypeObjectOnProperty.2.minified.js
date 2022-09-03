//// [comparisonOperatorWithSubtypeObjectOnProperty.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var a1, a2, b1, b2, Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
}, Derived = function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        return _class_call_check(this, Derived), _super.apply(this, arguments);
    }
    return Derived;
}(Base), A1 = function A1() {
    "use strict";
    _class_call_check(this, A1);
}, B1 = function B1() {
    "use strict";
    _class_call_check(this, B1);
}, A2 = function A2() {
    "use strict";
    _class_call_check(this, A2);
}, B2 = function(A2) {
    "use strict";
    _inherits(B2, A2);
    var _super = _create_super(B2);
    function B2() {
        return _class_call_check(this, B2), _super.apply(this, arguments);
    }
    return B2;
}(A2), ra1 = a1 < b1, ra2 = a2 < b2, ra3 = b1 < a1, ra4 = b2 < a2, rb1 = a1 > b1, rb2 = a2 > b2, rb3 = b1 > a1, rb4 = b2 > a2, rc1 = a1 <= b1, rc2 = a2 <= b2, rc3 = b1 <= a1, rc4 = b2 <= a2, rd1 = a1 >= b1, rd2 = a2 >= b2, rd3 = b1 >= a1, rd4 = b2 >= a2, re1 = a1 == b1, re2 = a2 == b2, re3 = b1 == a1, re4 = b2 == a2, rf1 = a1 != b1, rf2 = a2 != b2, rf3 = b1 != a1, rf4 = b2 != a2, rg1 = a1 === b1, rg2 = a2 === b2, rg3 = b1 === a1, rg4 = b2 === a2, rh1 = a1 !== b1, rh2 = a2 !== b2, rh3 = b1 !== a1, rh4 = b2 !== a2;
