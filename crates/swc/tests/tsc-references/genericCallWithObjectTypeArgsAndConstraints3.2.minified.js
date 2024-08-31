//// [genericCallWithObjectTypeArgsAndConstraints3.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var y, y1, Base = function Base() {
    _class_call_check(this, Base);
}, Derived = /*#__PURE__*/ function(Base) {
    function Derived() {
        return _class_call_check(this, Derived), _call_super(this, Derived, arguments);
    }
    return _inherits(Derived, Base), Derived;
}(Base), Derived2 = /*#__PURE__*/ function(Base) {
    function Derived2() {
        return _class_call_check(this, Derived2), _call_super(this, Derived2, arguments);
    }
    return _inherits(Derived2, Base), Derived2;
}(Base);
new Derived(), new Derived2(), new Derived(), new Derived2(), new Derived(), new Derived2(), y = function(x) {
    return x;
}, new Base(), y(null), y1 = function(x) {
    return x;
}, new Derived(), y1(null);
