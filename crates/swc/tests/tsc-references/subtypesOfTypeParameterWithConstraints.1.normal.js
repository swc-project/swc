//// [subtypesOfTypeParameterWithConstraints.ts]
// checking whether other types are subtypes of type parameters with constraints
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var C3 = function C3() {
    "use strict";
    _class_call_check(this, C3);
};
var D1 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D1, C3);
    function D1() {
        _class_call_check(this, D1);
        return _call_super(this, D1, arguments);
    }
    return D1;
}(C3);
var D2 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D2, C3);
    function D2() {
        _class_call_check(this, D2);
        return _call_super(this, D2, arguments);
    }
    return D2;
}(C3);
var D3 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D3, C3);
    function D3() {
        _class_call_check(this, D3);
        return _call_super(this, D3, arguments);
    }
    return D3;
}(C3);
var D4 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D4, C3);
    function D4() {
        _class_call_check(this, D4);
        return _call_super(this, D4, arguments);
    }
    return D4;
}(C3);
// V > U > T
// test if T is subtype of T, U, V
// should all work
var D5 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D5, C3);
    function D5() {
        _class_call_check(this, D5);
        return _call_super(this, D5, arguments);
    }
    return D5;
}(C3);
var D6 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D6, C3);
    function D6() {
        _class_call_check(this, D6);
        return _call_super(this, D6, arguments);
    }
    return D6;
}(C3);
var D7 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D7, C3);
    function D7() {
        _class_call_check(this, D7);
        return _call_super(this, D7, arguments);
    }
    return D7;
}(C3);
// test if U is a subtype of T, U, V
// only a subtype of V and itself
var D8 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D8, C3);
    function D8() {
        _class_call_check(this, D8);
        return _call_super(this, D8, arguments);
    }
    return D8;
}(C3);
var D9 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D9, C3);
    function D9() {
        _class_call_check(this, D9);
        return _call_super(this, D9, arguments);
    }
    return D9;
}(C3);
var D10 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D10, C3);
    function D10() {
        _class_call_check(this, D10);
        return _call_super(this, D10, arguments);
    }
    return D10;
}(C3);
// test if V is a subtype of T, U, V
// only a subtype of itself
var D11 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D11, C3);
    function D11() {
        _class_call_check(this, D11);
        return _call_super(this, D11, arguments);
    }
    return D11;
}(C3);
var D12 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D12, C3);
    function D12() {
        _class_call_check(this, D12);
        return _call_super(this, D12, arguments);
    }
    return D12;
}(C3);
var D13 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D13, C3);
    function D13() {
        _class_call_check(this, D13);
        return _call_super(this, D13, arguments);
    }
    return D13;
}(C3);
// Date > V > U > T
// test if T is subtype of T, U, V, Date
// should all work
var D14 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D14, C3);
    function D14() {
        _class_call_check(this, D14);
        return _call_super(this, D14, arguments);
    }
    return D14;
}(C3);
var D15 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D15, C3);
    function D15() {
        _class_call_check(this, D15);
        return _call_super(this, D15, arguments);
    }
    return D15;
}(C3);
var D16 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D16, C3);
    function D16() {
        _class_call_check(this, D16);
        return _call_super(this, D16, arguments);
    }
    return D16;
}(C3);
var D17 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D17, C3);
    function D17() {
        _class_call_check(this, D17);
        return _call_super(this, D17, arguments);
    }
    return D17;
}(C3);
// test if U is a subtype of T, U, V, Date
// only a subtype of V, Date and itself
var D18 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D18, C3);
    function D18() {
        _class_call_check(this, D18);
        return _call_super(this, D18, arguments);
    }
    return D18;
}(C3);
var D19 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D19, C3);
    function D19() {
        _class_call_check(this, D19);
        return _call_super(this, D19, arguments);
    }
    return D19;
}(C3);
var D20 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D20, C3);
    function D20() {
        _class_call_check(this, D20);
        return _call_super(this, D20, arguments);
    }
    return D20;
}(C3);
var D21 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D21, C3);
    function D21() {
        _class_call_check(this, D21);
        return _call_super(this, D21, arguments);
    }
    return D21;
}(C3);
// test if V is a subtype of T, U, V, Date
// only a subtype of itself and Date
var D22 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D22, C3);
    function D22() {
        _class_call_check(this, D22);
        return _call_super(this, D22, arguments);
    }
    return D22;
}(C3);
var D23 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D23, C3);
    function D23() {
        _class_call_check(this, D23);
        return _call_super(this, D23, arguments);
    }
    return D23;
}(C3);
var D24 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D24, C3);
    function D24() {
        _class_call_check(this, D24);
        return _call_super(this, D24, arguments);
    }
    return D24;
}(C3);
var D25 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D25, C3);
    function D25() {
        _class_call_check(this, D25);
        return _call_super(this, D25, arguments);
    }
    return D25;
}(C3);
// test if Date is a subtype of T, U, V, Date
// only a subtype of itself
var D26 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D26, C3);
    function D26() {
        _class_call_check(this, D26);
        return _call_super(this, D26, arguments);
    }
    return D26;
}(C3);
var D27 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D27, C3);
    function D27() {
        _class_call_check(this, D27);
        return _call_super(this, D27, arguments);
    }
    return D27;
}(C3);
var D28 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D28, C3);
    function D28() {
        _class_call_check(this, D28);
        return _call_super(this, D28, arguments);
    }
    return D28;
}(C3);
var D29 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D29, C3);
    function D29() {
        _class_call_check(this, D29);
        return _call_super(this, D29, arguments);
    }
    return D29;
}(C3);
