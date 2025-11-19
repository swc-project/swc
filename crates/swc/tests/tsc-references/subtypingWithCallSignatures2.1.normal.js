//// [subtypingWithCallSignatures2.ts]
// checking subtype relations for function types as it relates to contextual signature instantiation
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    function Derived() {
        _class_call_check(this, Derived);
        return _call_super(this, Derived, arguments);
    }
    return Derived;
}(Base);
var Derived2 = /*#__PURE__*/ function(Derived) {
    "use strict";
    _inherits(Derived2, Derived);
    function Derived2() {
        _class_call_check(this, Derived2);
        return _call_super(this, Derived2, arguments);
    }
    return Derived2;
}(Derived);
var OtherDerived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(OtherDerived, Base);
    function OtherDerived() {
        _class_call_check(this, OtherDerived);
        return _call_super(this, OtherDerived, arguments);
    }
    return OtherDerived;
}(Base);
var r1arg1 = function(x) {
    return [
        x
    ];
};
var r1arg2 = function(x) {
    return [
        1
    ];
};
var r1 = foo1(r1arg1); // any, return types are not subtype of first overload
var r1a = [
    r1arg2,
    r1arg1
]; // generic signature, subtype in both directions
var r1b = [
    r1arg1,
    r1arg2
]; // generic signature, subtype in both directions
var r2arg1 = function(x) {
    return [
        ''
    ];
};
var r2arg2 = function(x) {
    return [
        ''
    ];
};
var r2 = foo2(r2arg1);
var r2a = [
    r2arg1,
    r2arg2
];
var r2b = [
    r2arg2,
    r2arg1
];
var r3arg1 = function(x) {
    return x;
};
var r3arg2 = function(x) {};
var r3 = foo3(r3arg1);
var r3a = [
    r3arg1,
    r3arg2
];
var r3b = [
    r3arg2,
    r3arg1
];
var r4arg1 = function(x, y) {
    return x;
};
var r4arg2 = function(x, y) {
    return '';
};
var r4 = foo4(r4arg1); // any
var r4a = [
    r4arg1,
    r4arg2
];
var r4b = [
    r4arg2,
    r4arg1
];
var r5arg1 = function(x) {
    return null;
};
var r5arg2 = function(x) {
    return '';
};
var r5 = foo5(r5arg1); // any
var r5a = [
    r5arg1,
    r5arg2
];
var r5b = [
    r5arg2,
    r5arg1
];
var r6arg1 = function(x) {
    return null;
};
var r6arg2 = function(x) {
    return null;
};
var r6 = foo6(r6arg1); // any
var r6a = [
    r6arg1,
    r6arg2
];
var r6b = [
    r6arg2,
    r6arg1
];
var r7arg1 = function(x) {
    return function(r) {
        return null;
    };
};
var r7arg2 = function(x) {
    return function(r) {
        return null;
    };
};
var r7 = foo7(r7arg1); // any
var r7a = [
    r7arg1,
    r7arg2
];
var r7b = [
    r7arg2,
    r7arg1
];
var r8arg1 = function(x, y) {
    return function(r) {
        return null;
    };
};
var r8arg2 = function(x, y) {
    return function(r) {
        return null;
    };
};
var r8 = foo8(r8arg1); // any
var r8a = [
    r8arg1,
    r8arg2
];
var r8b = [
    r8arg2,
    r8arg1
];
var r9arg1 = function(x, y) {
    return function(r) {
        return null;
    };
};
var r9arg2 = function(x, y) {
    return function(r) {
        return null;
    };
};
var r9 = foo9(r9arg1); // any
var r9a = [
    r9arg1,
    r9arg2
];
var r9b = [
    r9arg2,
    r9arg1
];
var r10arg1 = function() {
    for(var _len = arguments.length, x = new Array(_len), _key = 0; _key < _len; _key++){
        x[_key] = arguments[_key];
    }
    return x[0];
};
var r10arg2 = function() {
    for(var _len = arguments.length, x = new Array(_len), _key = 0; _key < _len; _key++){
        x[_key] = arguments[_key];
    }
    return null;
};
var r10 = foo10(r10arg1); // any
var r10a = [
    r10arg1,
    r10arg2
];
var r10b = [
    r10arg2,
    r10arg1
];
var r11arg1 = function(x, y) {
    return x;
};
var r11arg2 = function(x, y) {
    return null;
};
var r11 = foo11(r11arg1); // any
var r11a = [
    r11arg1,
    r11arg2
];
var r11b = [
    r11arg2,
    r11arg1
];
var r12arg1 = function(x, y) {
    return null;
};
var r12arg2 = function(x, y) {
    return null;
};
var r12 = foo12(r12arg1); // any
var r12a = [
    r12arg1,
    r12arg2
];
var r12b = [
    r12arg2,
    r12arg1
];
var r13arg1 = function(x, y) {
    return y;
};
var r13arg2 = function(x, y) {
    return null;
};
var r13 = foo13(r13arg1); // any
var r13a = [
    r13arg1,
    r13arg2
];
var r13b = [
    r13arg2,
    r13arg1
];
var r14arg1 = function(x) {
    return x.a;
};
var r14arg2 = function(x) {
    return null;
};
var r14 = foo14(r14arg1); // any
var r14a = [
    r14arg1,
    r14arg2
];
var r14b = [
    r14arg2,
    r14arg1
];
var r15arg1 = function(x) {
    return null;
};
var r15 = foo15(r15arg1); // any
var r16arg1 = function(x) {
    return [
        1
    ];
};
var r16 = foo16(r16arg1);
var r17arg1 = function(x) {
    return null;
};
var r17 = foo17(r17arg1); // any
var r18arg1 = function(x) {
    return null;
};
var r18 = foo18(r18arg1);
