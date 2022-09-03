//// [subtypingWithConstructSignatures4.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var r1arg, r1arg2, r2arg, r2arg2, r3arg, r3arg2, r4arg, r4arg2, r5arg, r5arg2, r6arg, r6arg2, r11arg, r11arg2, r15arg, r15arg2, r16arg, r16arg2, r17arg, r18arg, Base = function Base() {
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
}(Base), r1 = foo1(r1arg), r1a = [
    r1arg,
    r1arg2
], r1b = [
    r1arg2,
    r1arg
], r2 = foo2(r2arg), r2a = [
    r2arg,
    r2arg2
], r2b = [
    r2arg2,
    r2arg
], r3 = foo3(r3arg), r3a = [
    r3arg,
    r3arg2
], r3b = [
    r3arg2,
    r3arg
], r4 = foo4(r4arg), r4a = [
    r4arg,
    r4arg2
], r4b = [
    r4arg2,
    r4arg
], r5 = foo5(r5arg), r5a = [
    r5arg,
    r5arg2
], r5b = [
    r5arg2,
    r5arg
], r6 = foo6(r6arg), r6a = [
    r6arg,
    r6arg2
], r6b = [
    r6arg2,
    r6arg
], r11 = foo11(r11arg), r11a = [
    r11arg,
    r11arg2
], r11b = [
    r11arg2,
    r11arg
], r15 = foo15(r15arg), r15a = [
    r15arg,
    r15arg2
], r15b = [
    r15arg2,
    r15arg
], r16 = foo16(r16arg), r16a = [
    r16arg,
    r16arg2
], r16b = [
    r16arg2,
    r16arg
], r17 = foo17(r17arg), r18 = foo18(r18arg);
