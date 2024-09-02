//// [arrayLiterals.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var C = function C() {
    _class_call_check(this, C);
};
new C(), new C();
var Base = function Base() {
    _class_call_check(this, Base);
}, Derived1 = /*#__PURE__*/ function(Base) {
    function Derived1() {
        return _class_call_check(this, Derived1), _call_super(this, Derived1, arguments);
    }
    return _inherits(Derived1, Base), Derived1;
}(Base), Derived2 = /*#__PURE__*/ function(Base) {
    function Derived2() {
        return _class_call_check(this, Derived2), _call_super(this, Derived2, arguments);
    }
    return _inherits(Derived2, Base), Derived2;
}(Base);
new Derived1(), new Derived2(), new Derived1(), new Derived1();
