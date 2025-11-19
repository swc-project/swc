//// [subtypingWithConstructSignatures4.ts]
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
var r1arg;
var r1arg2;
var r1 = foo1(r1arg);
var r1a = [
    r1arg,
    r1arg2
];
var r1b = [
    r1arg2,
    r1arg
];
var r2arg;
var r2arg2;
var r2 = foo2(r2arg);
var r2a = [
    r2arg,
    r2arg2
];
var r2b = [
    r2arg2,
    r2arg
];
var r3arg;
var r3arg2;
var r3 = foo3(r3arg);
var r3a = [
    r3arg,
    r3arg2
];
var r3b = [
    r3arg2,
    r3arg
];
var r4arg;
var r4arg2;
var r4 = foo4(r4arg);
var r4a = [
    r4arg,
    r4arg2
];
var r4b = [
    r4arg2,
    r4arg
];
var r5arg;
var r5arg2;
var r5 = foo5(r5arg);
var r5a = [
    r5arg,
    r5arg2
];
var r5b = [
    r5arg2,
    r5arg
];
var r6arg;
var r6arg2;
var r6 = foo6(r6arg);
var r6a = [
    r6arg,
    r6arg2
];
var r6b = [
    r6arg2,
    r6arg
];
var r11arg;
var r11arg2;
var r11 = foo11(r11arg);
var r11a = [
    r11arg,
    r11arg2
];
var r11b = [
    r11arg2,
    r11arg
];
var r15arg;
var r15arg2;
var r15 = foo15(r15arg);
var r15a = [
    r15arg,
    r15arg2
];
var r15b = [
    r15arg2,
    r15arg
];
var r16arg;
var r16arg2;
var r16 = foo16(r16arg);
var r16a = [
    r16arg,
    r16arg2
];
var r16b = [
    r16arg2,
    r16arg
];
var r17arg;
var r17 = foo17(r17arg);
var r18arg;
var r18 = foo18(r18arg);
