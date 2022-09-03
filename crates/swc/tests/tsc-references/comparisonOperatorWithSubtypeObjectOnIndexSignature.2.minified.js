//// [comparisonOperatorWithSubtypeObjectOnIndexSignature.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var a1, b1, a2, b2, a3, b3, a4, b4, Base = function Base() {
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
}(Base), r1a1 = a1 < b1, r1a1 = a2 < b2, r1a1 = a3 < b3, r1a1 = a4 < b4, r1b1 = b1 < a1, r1b1 = b2 < a2, r1b1 = b3 < a3, r1b1 = b4 < a4, r2a1 = a1 > b1, r2a1 = a2 > b2, r2a1 = a3 > b3, r2a1 = a4 > b4, r2b1 = b1 > a1, r2b1 = b2 > a2, r2b1 = b3 > a3, r2b1 = b4 > a4, r3a1 = a1 <= b1, r3a1 = a2 <= b2, r3a1 = a3 <= b3, r3a1 = a4 <= b4, r3b1 = b1 <= a1, r3b1 = b2 <= a2, r3b1 = b3 <= a3, r3b1 = b4 <= a4, r4a1 = a1 >= b1, r4a1 = a2 >= b2, r4a1 = a3 >= b3, r4a1 = a4 >= b4, r4b1 = b1 >= a1, r4b1 = b2 >= a2, r4b1 = b3 >= a3, r4b1 = b4 >= a4, r5a1 = a1 == b1, r5a1 = a2 == b2, r5a1 = a3 == b3, r5a1 = a4 == b4, r5b1 = b1 == a1, r5b1 = b2 == a2, r5b1 = b3 == a3, r5b1 = b4 == a4, r6a1 = a1 != b1, r6a1 = a2 != b2, r6a1 = a3 != b3, r6a1 = a4 != b4, r6b1 = b1 != a1, r6b1 = b2 != a2, r6b1 = b3 != a3, r6b1 = b4 != a4, r7a1 = a1 === b1, r7a1 = a2 === b2, r7a1 = a3 === b3, r7a1 = a4 === b4, r7b1 = b1 === a1, r7b1 = b2 === a2, r7b1 = b3 === a3, r7b1 = b4 === a4, r8a1 = a1 !== b1, r8a1 = a2 !== b2, r8a1 = a3 !== b3, r8a1 = a4 !== b4, r8b1 = b1 !== a1, r8b1 = b2 !== a2, r8b1 = b3 !== a3, r8b1 = b4 !== a4;
