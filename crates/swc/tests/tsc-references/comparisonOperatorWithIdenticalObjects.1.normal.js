//// [comparisonOperatorWithIdenticalObjects.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var A1 = /*#__PURE__*/ function() {
    "use strict";
    function A1() {
        _class_call_check(this, A1);
    }
    var _proto = A1.prototype;
    _proto.fn = function fn(a) {
        return null;
    };
    return A1;
}();
var B1 = /*#__PURE__*/ function() {
    "use strict";
    function B1() {
        _class_call_check(this, B1);
    }
    var _proto = B1.prototype;
    _proto.fn = function fn(b) {
        return null;
    };
    return B1;
}();
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base() {
        _class_call_check(this, Base);
    }
    var _proto = Base.prototype;
    _proto.fn = function fn(b) {
        return null;
    };
    return Base;
}();
var A2 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(A2, Base);
    function A2() {
        _class_call_check(this, A2);
        return _call_super(this, A2, arguments);
    }
    return A2;
}(Base);
var B2 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(B2, Base);
    function B2() {
        _class_call_check(this, B2);
        return _call_super(this, B2, arguments);
    }
    return B2;
}(Base);
var a1;
var a2;
var a3;
var a4;
var a5;
var a6;
var b1;
var b2;
var b3;
var b4;
var b5;
var b6;
var base1;
var base2;
// operator <
var r1a1 = a1 < b1;
var r1a2 = base1 < base2;
var r1a3 = a2 < b2;
var r1a4 = a3 < b3;
var r1a5 = a4 < b4;
var r1a6 = a5 < b5;
var r1a7 = a6 < b6;
var r1b1 = b1 < a1;
var r1b2 = base2 < base1;
var r1b3 = b2 < a2;
var r1b4 = b3 < a3;
var r1b5 = b4 < a4;
var r1b6 = b5 < a5;
var r1b7 = b6 < a6;
// operator >
var r2a1 = a1 > b1;
var r2a2 = base1 > base2;
var r2a3 = a2 > b2;
var r2a4 = a3 > b3;
var r2a5 = a4 > b4;
var r2a6 = a5 > b5;
var r2a7 = a6 > b6;
var r2b1 = b1 > a1;
var r2b2 = base2 > base1;
var r2b3 = b2 > a2;
var r2b4 = b3 > a3;
var r2b5 = b4 > a4;
var r2b6 = b5 > a5;
var r2b7 = b6 > a6;
// operator <=
var r3a1 = a1 <= b1;
var r3a2 = base1 <= base2;
var r3a3 = a2 <= b2;
var r3a4 = a3 <= b3;
var r3a5 = a4 <= b4;
var r3a6 = a5 <= b5;
var r3a7 = a6 <= b6;
var r3b1 = b1 <= a1;
var r3b2 = base2 <= base1;
var r3b3 = b2 <= a2;
var r3b4 = b3 <= a3;
var r3b5 = b4 <= a4;
var r3b6 = b5 <= a5;
var r3b7 = b6 <= a6;
// operator >=
var r4a1 = a1 >= b1;
var r4a2 = base1 >= base2;
var r4a3 = a2 >= b2;
var r4a4 = a3 >= b3;
var r4a5 = a4 >= b4;
var r4a6 = a5 >= b5;
var r4a7 = a6 >= b6;
var r4b1 = b1 >= a1;
var r4b2 = base2 >= base1;
var r4b3 = b2 >= a2;
var r4b4 = b3 >= a3;
var r4b5 = b4 >= a4;
var r4b6 = b5 >= a5;
var r4b7 = b6 >= a6;
// operator ==
var r5a1 = a1 == b1;
var r5a2 = base1 == base2;
var r5a3 = a2 == b2;
var r5a4 = a3 == b3;
var r5a5 = a4 == b4;
var r5a6 = a5 == b5;
var r5a7 = a6 == b6;
var r5b1 = b1 == a1;
var r5b2 = base2 == base1;
var r5b3 = b2 == a2;
var r5b4 = b3 == a3;
var r5b5 = b4 == a4;
var r5b6 = b5 == a5;
var r5b7 = b6 == a6;
// operator !=
var r6a1 = a1 != b1;
var r6a2 = base1 != base2;
var r6a3 = a2 != b2;
var r6a4 = a3 != b3;
var r6a5 = a4 != b4;
var r6a6 = a5 != b5;
var r6a7 = a6 != b6;
var r6b1 = b1 != a1;
var r6b2 = base2 != base1;
var r6b3 = b2 != a2;
var r6b4 = b3 != a3;
var r6b5 = b4 != a4;
var r6b6 = b5 != a5;
var r6b7 = b6 != a6;
// operator ===
var r7a1 = a1 === b1;
var r7a2 = base1 === base2;
var r7a3 = a2 === b2;
var r7a4 = a3 === b3;
var r7a5 = a4 === b4;
var r7a6 = a5 === b5;
var r7a7 = a6 === b6;
var r7b1 = b1 === a1;
var r7b2 = base2 === base1;
var r7b3 = b2 === a2;
var r7b4 = b3 === a3;
var r7b5 = b4 === a4;
var r7b6 = b5 === a5;
var r7b7 = b6 === a6;
// operator !==
var r8a1 = a1 !== b1;
var r8a2 = base1 !== base2;
var r8a3 = a2 !== b2;
var r8a4 = a3 !== b3;
var r8a5 = a4 !== b4;
var r8a6 = a5 !== b5;
var r8a7 = a6 !== b6;
var r8b1 = b1 !== a1;
var r8b2 = base2 !== base1;
var r8b3 = b2 !== a2;
var r8b4 = b3 !== a3;
var r8b5 = b4 !== a4;
var r8b6 = b5 !== a5;
var r8b7 = b6 !== a6;
