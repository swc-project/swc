//// [comparisonOperatorWithSubtypeObjectOnConstructorSignature.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var a1, b1, a2, b2, a3, b3, a4, b4, a5, b5, a6, b6, a7, b7, a8, b8, a9, b9, Base = function Base() {
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
}(Base), r1a1 = a1 < b1, r1a2 = a2 < b2, r1a3 = a3 < b3, r1a4 = a4 < b4, r1a5 = a5 < b5, r1a6 = a6 < b6, r1a7 = a7 < b7, r1a8 = a8 < b8, r1a9 = a9 < b9, r1b1 = b1 < a1, r1b2 = b2 < a2, r1b3 = b3 < a3, r1b4 = b4 < a4, r1b5 = b5 < a5, r1b6 = b6 < a6, r1b7 = b7 < a7, r1b8 = b8 < a8, r1b9 = b9 < a9, r2a1 = a1 > b1, r2a2 = a2 > b2, r2a3 = a3 > b3, r2a4 = a4 > b4, r2a5 = a5 > b5, r2a6 = a6 > b6, r2a7 = a7 > b7, r2a8 = a8 > b8, r2a9 = a9 > b9, r2b1 = b1 > a1, r2b2 = b2 > a2, r2b3 = b3 > a3, r2b4 = b4 > a4, r2b5 = b5 > a5, r2b6 = b6 > a6, r2b7 = b7 > a7, r2b8 = b8 > a8, r2b9 = b9 > a9, r3a1 = a1 <= b1, r3a2 = a2 <= b2, r3a3 = a3 <= b3, r3a4 = a4 <= b4, r3a5 = a5 <= b5, r3a6 = a6 <= b6, r3a7 = a7 <= b7, r3a8 = a8 <= b8, r3a9 = a9 <= b9, r3b1 = b1 <= a1, r3b2 = b2 <= a2, r3b3 = b3 <= a3, r3b4 = b4 <= a4, r3b5 = b5 <= a5, r3b6 = b6 <= a6, r3b7 = b7 <= a7, r3b8 = b8 <= a8, r3b9 = b9 <= a9, r4a1 = a1 >= b1, r4a2 = a2 >= b2, r4a3 = a3 >= b3, r4a4 = a4 >= b4, r4a5 = a5 >= b5, r4a6 = a6 >= b6, r4a7 = a7 >= b7, r4a8 = a8 >= b8, r4a9 = a9 >= b9, r4b1 = b1 >= a1, r4b2 = b2 >= a2, r4b3 = b3 >= a3, r4b4 = b4 >= a4, r4b5 = b5 >= a5, r4b6 = b6 >= a6, r4b7 = b7 >= a7, r4b8 = b8 >= a8, r4b9 = b9 >= a9, r5a1 = a1 == b1, r5a2 = a2 == b2, r5a3 = a3 == b3, r5a4 = a4 == b4, r5a5 = a5 == b5, r5a6 = a6 == b6, r5a7 = a7 == b7, r5a8 = a8 == b8, r5a9 = a9 == b9, r5b1 = b1 == a1, r5b2 = b2 == a2, r5b3 = b3 == a3, r5b4 = b4 == a4, r5b5 = b5 == a5, r5b6 = b6 == a6, r5b7 = b7 == a7, r5b8 = b8 == a8, r5b9 = b9 == a9, r6a1 = a1 != b1, r6a2 = a2 != b2, r6a3 = a3 != b3, r6a4 = a4 != b4, r6a5 = a5 != b5, r6a6 = a6 != b6, r6a7 = a7 != b7, r6a8 = a8 != b8, r6a9 = a9 != b9, r6b1 = b1 != a1, r6b2 = b2 != a2, r6b3 = b3 != a3, r6b4 = b4 != a4, r6b5 = b5 != a5, r6b6 = b6 != a6, r6b7 = b7 != a7, r6b8 = b8 != a8, r6b9 = b9 != a9, r7a1 = a1 === b1, r7a2 = a2 === b2, r7a3 = a3 === b3, r7a4 = a4 === b4, r7a5 = a5 === b5, r7a6 = a6 === b6, r7a7 = a7 === b7, r7a8 = a8 === b8, r7a9 = a9 === b9, r7b1 = b1 === a1, r7b2 = b2 === a2, r7b3 = b3 === a3, r7b4 = b4 === a4, r7b5 = b5 === a5, r7b6 = b6 === a6, r7b7 = b7 === a7, r7b8 = b8 === a8, r7b9 = b9 === a9, r8a1 = a1 !== b1, r8a2 = a2 !== b2, r8a3 = a3 !== b3, r8a4 = a4 !== b4, r8a5 = a5 !== b5, r8a6 = a6 !== b6, r8a7 = a7 !== b7, r8a8 = a8 !== b8, r8a9 = a9 !== b9, r8b1 = b1 !== a1, r8b2 = b2 !== a2, r8b3 = b3 !== a3, r8b4 = b4 !== a4, r8b5 = b5 !== a5, r8b6 = b6 !== a6, r8b7 = b7 !== a7, r8b8 = b8 !== a8, r8b9 = b9 !== a9;
