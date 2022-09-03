//// [arrayLiterals.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var classTypeArray, arr1 = [
    [],
    [
        1
    ],
    [
        ""
    ]
], arr2 = [
    [
        null
    ],
    [
        1
    ],
    [
        ""
    ]
], stringArrArr = [
    [
        ""
    ],
    [
        ""
    ]
], stringArr = [
    "",
    ""
], numberArr = [
    0,
    0.0,
    0x00,
    1e1
], boolArr = [
    !1,
    !0,
    !1,
    !0
], C = function C() {
    "use strict";
    _class_call_check(this, C);
}, classArr = [
    new C(),
    new C()
], classTypeArray = [
    C,
    C,
    C
], context1 = [
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
], context2 = [
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
], Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
}, Derived1 = function(Base) {
    "use strict";
    _inherits(Derived1, Base);
    var _super = _create_super(Derived1);
    function Derived1() {
        return _class_call_check(this, Derived1), _super.apply(this, arguments);
    }
    return Derived1;
}(Base), Derived2 = function(Base) {
    "use strict";
    _inherits(Derived2, Base);
    var _super = _create_super(Derived2);
    function Derived2() {
        return _class_call_check(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2;
}(Base), context3 = [
    new Derived1(),
    new Derived2()
], context4 = [
    new Derived1(),
    new Derived1()
];
