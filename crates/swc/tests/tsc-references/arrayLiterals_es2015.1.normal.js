// Empty array literal with no contextual type has type Undefined[]
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
    0,
    0,
    10
];
var boolArr = [
    false,
    true,
    false,
    true
];
class C {
}
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
class Base {
}
class Derived1 extends Base {
}
class Derived2 extends Base {
}
var context3 = [
    new Derived1(),
    new Derived2()
];
// Contextual type C with numeric index signature of type Base makes array literal of Derived1 and Derived2 have type Base[]
var context4 = [
    new Derived1(),
    new Derived1()
];
