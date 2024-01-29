//// [genericCallWithObjectTypeArgsAndConstraints3.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var y, y1, Base = function Base() {
    _class_call_check(this, Base);
}, Derived = function(Base) {
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        return _class_call_check(this, Derived), _super.apply(this, arguments);
    }
    return Derived;
}(Base), Derived2 = function(Base) {
    _inherits(Derived2, Base);
    var _super = _create_super(Derived2);
    function Derived2() {
        return _class_call_check(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2;
}(Base);
new Derived(), new Derived2(), new Derived(), new Derived2(), new Derived(), new Derived2(), y = function(x) {
    return x;
}, new Base(), y(null), y1 = function(x) {
    return x;
}, new Derived(), y1(null);
