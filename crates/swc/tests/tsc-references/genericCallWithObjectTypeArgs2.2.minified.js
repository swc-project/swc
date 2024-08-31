//// [genericCallWithObjectTypeArgs2.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var a, a1, i, Base = function Base() {
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
function f2(a) {
    return function(x) {
        return a.y;
    };
}
(a = {
    x: new Derived(),
    y: new Derived2()
}).x, a.y, (a1 = {
    x: new Base(),
    y: new Derived2()
}).x, a1.y, f2({
    x: new Derived(),
    y: new Derived2()
}), f2(i);
