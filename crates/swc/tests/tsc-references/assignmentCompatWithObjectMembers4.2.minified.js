//// [assignmentCompatWithObjectMembers4.ts]
var OnlyDerived, WithBase, s, t, s2, t2, b, Base, Derived, Derived2, a2, s1, t1, s21, t21, b1, Base1, Derived21, a21;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
OnlyDerived || (OnlyDerived = {}), Derived = function(Base) {
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        return _class_call_check(this, Derived), _super.apply(this, arguments);
    }
    return Derived;
}(Base = function Base() {
    _class_call_check(this, Base);
}), Derived2 = function(Base) {
    _inherits(Derived2, Base);
    var _super = _create_super(Derived2);
    function Derived2() {
        return _class_call_check(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2;
}(Base), a2 = {
    foo: new Derived()
}, new Derived2(), s = t, t = s, s = s2, s = a2, s2 = t2, t2 = s2, s2 = t, s2 = b, s2 = a2, WithBase || (WithBase = {}), Derived21 = function(Base) {
    _inherits(Derived2, Base);
    var _super = _create_super(Derived2);
    function Derived2() {
        return _class_call_check(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2;
}(Base1 = function Base() {
    _class_call_check(this, Base);
}), a21 = {
    foo: new Base1()
}, new Derived21(), s1 = t1, t1 = s1, s1 = s21, s1 = a21, s21 = t21, t21 = s21, s21 = t1, s21 = b1, s21 = a21;
