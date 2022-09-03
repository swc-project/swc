//// [subtypingWithCallSignatures2.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Base = function Base() {
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
}(Base), Derived2 = function(Derived) {
    "use strict";
    _inherits(Derived2, Derived);
    var _super = _create_super(Derived2);
    function Derived2() {
        return _class_call_check(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2;
}(Derived), OtherDerived = function(Base) {
    "use strict";
    _inherits(OtherDerived, Base);
    var _super = _create_super(OtherDerived);
    function OtherDerived() {
        return _class_call_check(this, OtherDerived), _super.apply(this, arguments);
    }
    return OtherDerived;
}(Base), r1arg1 = function(x) {
    return [
        x
    ];
}, r1arg2 = function(x) {
    return [
        1
    ];
}, r1 = foo1(r1arg1), r1a = [
    r1arg2,
    r1arg1
], r1b = [
    r1arg1,
    r1arg2
], r2arg1 = function(x) {
    return [
        ""
    ];
}, r2arg2 = function(x) {
    return [
        ""
    ];
}, r2 = foo2(r2arg1), r2a = [
    r2arg1,
    r2arg2
], r2b = [
    r2arg2,
    r2arg1
], r3arg1 = function(x) {
    return x;
}, r3arg2 = function(x) {}, r3 = foo3(r3arg1), r3a = [
    r3arg1,
    r3arg2
], r3b = [
    r3arg2,
    r3arg1
], r4arg1 = function(x, y) {
    return x;
}, r4arg2 = function(x, y) {
    return "";
}, r4 = foo4(r4arg1), r4a = [
    r4arg1,
    r4arg2
], r4b = [
    r4arg2,
    r4arg1
], r5arg1 = function(x) {
    return null;
}, r5arg2 = function(x) {
    return "";
}, r5 = foo5(r5arg1), r5a = [
    r5arg1,
    r5arg2
], r5b = [
    r5arg2,
    r5arg1
], r6arg1 = function(x) {
    return null;
}, r6arg2 = function(x) {
    return null;
}, r6 = foo6(r6arg1), r6a = [
    r6arg1,
    r6arg2
], r6b = [
    r6arg2,
    r6arg1
], r7arg1 = function(x) {
    return function(r) {
        return null;
    };
}, r7arg2 = function(x) {
    return function(r) {
        return null;
    };
}, r7 = foo7(r7arg1), r7a = [
    r7arg1,
    r7arg2
], r7b = [
    r7arg2,
    r7arg1
], r8arg1 = function(x, y) {
    return function(r) {
        return null;
    };
}, r8arg2 = function(x, y) {
    return function(r) {
        return null;
    };
}, r8 = foo8(r8arg1), r8a = [
    r8arg1,
    r8arg2
], r8b = [
    r8arg2,
    r8arg1
], r9arg1 = function(x, y) {
    return function(r) {
        return null;
    };
}, r9arg2 = function(x, y) {
    return function(r) {
        return null;
    };
}, r9 = foo9(r9arg1), r9a = [
    r9arg1,
    r9arg2
], r9b = [
    r9arg2,
    r9arg1
], r10arg1 = function() {
    for(var _len = arguments.length, x = Array(_len), _key = 0; _key < _len; _key++)x[_key] = arguments[_key];
    return x[0];
}, r10arg2 = function() {
    for(var _len = arguments.length, x = Array(_len), _key = 0; _key < _len; _key++)x[_key] = arguments[_key];
    return null;
}, r10 = foo10(r10arg1), r10a = [
    r10arg1,
    r10arg2
], r10b = [
    r10arg2,
    r10arg1
], r11arg1 = function(x, y) {
    return x;
}, r11arg2 = function(x, y) {
    return null;
}, r11 = foo11(r11arg1), r11a = [
    r11arg1,
    r11arg2
], r11b = [
    r11arg2,
    r11arg1
], r12arg1 = function(x, y) {
    return null;
}, r12arg2 = function(x, y) {
    return null;
}, r12 = foo12(r12arg1), r12a = [
    r12arg1,
    r12arg2
], r12b = [
    r12arg2,
    r12arg1
], r13arg1 = function(x, y) {
    return y;
}, r13arg2 = function(x, y) {
    return null;
}, r13 = foo13(r13arg1), r13a = [
    r13arg1,
    r13arg2
], r13b = [
    r13arg2,
    r13arg1
], r14arg1 = function(x) {
    return x.a;
}, r14arg2 = function(x) {
    return null;
}, r14 = foo14(r14arg1), r14a = [
    r14arg1,
    r14arg2
], r14b = [
    r14arg2,
    r14arg1
], r15arg1 = function(x) {
    return null;
}, r15 = foo15(r15arg1), r16arg1 = function(x) {
    return [
        1
    ];
}, r16 = foo16(r16arg1), r17arg1 = function(x) {
    return null;
}, r17 = foo17(r17arg1), r18arg1 = function(x) {
    return null;
}, r18 = foo18(r18arg1);
