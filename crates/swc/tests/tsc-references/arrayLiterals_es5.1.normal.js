import * as swcHelpers from "@swc/helpers";
// Empty array literal with no contextual type has type Undefined[]
var arr1 = [
    [],
    [
        1
    ],
    [
        ""
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
        ""
    ]
];
// Array literal with elements of only EveryType E has type E[]
var stringArrArr = [
    [
        ""
    ],
    [
        ""
    ]
];
var stringArr = [
    "",
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
    swcHelpers.classCallCheck(this, C);
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
        a: "",
        b: 0,
        c: ""
    },
    {
        a: "",
        b: 3,
        c: 0
    }
];
var context2 = [
    {
        a: "",
        b: 0,
        c: ""
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
    swcHelpers.classCallCheck(this, Base);
};
var Derived1 = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived1, Base);
    var _super = swcHelpers.createSuper(Derived1);
    function Derived1() {
        swcHelpers.classCallCheck(this, Derived1);
        return _super.apply(this, arguments);
    }
    return Derived1;
}(Base);
var Derived2 = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived2, Base);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2() {
        swcHelpers.classCallCheck(this, Derived2);
        return _super.apply(this, arguments);
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
