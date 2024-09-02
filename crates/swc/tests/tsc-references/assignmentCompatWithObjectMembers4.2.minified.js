//// [assignmentCompatWithObjectMembers4.ts]
var OnlyDerived, WithBase, Base, Derived, Derived2, Base1, Derived21;
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
OnlyDerived || (OnlyDerived = {}), Derived = /*#__PURE__*/ function(Base) {
    function Derived() {
        return _class_call_check(this, Derived), _call_super(this, Derived, arguments);
    }
    return _inherits(Derived, Base), Derived;
}(Base = function Base() {
    _class_call_check(this, Base);
}), Derived2 = /*#__PURE__*/ function(Base) {
    function Derived2() {
        return _class_call_check(this, Derived2), _call_super(this, Derived2, arguments);
    }
    return _inherits(Derived2, Base), Derived2;
}(Base), new Derived(), new Derived2(), WithBase || (WithBase = {}), Derived21 = /*#__PURE__*/ function(Base) {
    function Derived2() {
        return _class_call_check(this, Derived2), _call_super(this, Derived2, arguments);
    }
    return _inherits(Derived2, Base), Derived2;
}(Base1 = function Base() {
    _class_call_check(this, Base);
}), new Base1(), new Derived21();
