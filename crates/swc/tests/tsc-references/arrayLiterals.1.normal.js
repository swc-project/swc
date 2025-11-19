//// [arrayLiterals.ts]
// Empty array literal with no contextual type has type Undefined[]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var arr1 = [
    [],
    [
        1
    ],
    [
        ''
    ]
];
var arr2 = [
    [
        null
    ],
    [
        1
    ],
    [
        ''
    ]
];
// Array literal with elements of only EveryType E has type E[]
var stringArrArr = [
    [
        ''
    ],
    [
        ""
    ]
];
var stringArr = [
    '',
    ""
];
var numberArr = [
    0,
    0.0,
    0x00,
    1e1
];
var boolArr = [
    false,
    true,
    false,
    true
];
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var classArr = [
    new C(),
    new C()
];
var classTypeArray = [
    C,
    C,
    C
];
var classTypeArray; // Should OK, not be a parse error
// Contextual type C with numeric index signature makes array literal of EveryType E of type BCT(E,C)[]
var context1 = [
    {
        a: '',
        b: 0,
        c: ''
    },
    {
        a: "",
        b: 3,
        c: 0
    }
];
var context2 = [
    {
        a: '',
        b: 0,
        c: ''
    },
    {
        a: "",
        b: 3,
        c: 0
    }
];
// Contextual type C with numeric index signature of type Base makes array literal of Derived have type Base[]
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
var Derived1 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived1, Base);
    function Derived1() {
        _class_call_check(this, Derived1);
        return _call_super(this, Derived1, arguments);
    }
    return Derived1;
}(Base);
var Derived2 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived2, Base);
    function Derived2() {
        _class_call_check(this, Derived2);
        return _call_super(this, Derived2, arguments);
    }
    return Derived2;
}(Base);
var context3 = [
    new Derived1(),
    new Derived2()
];
// Contextual type C with numeric index signature of type Base makes array literal of Derived1 and Derived2 have type Base[]
var context4 = [
    new Derived1(),
    new Derived1()
];
