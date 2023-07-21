//// [genericCallWithObjectTypeArgsAndConstraints2.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var Base = function Base() {
    _class_call_check(this, Base);
}, Derived = function(Base) {
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        return _class_call_check(this, Derived), _super.apply(this, arguments);
    }
    return Derived;
}(Base);
new Base(), new Derived(), new Derived(), new Derived(), new Base(), new Derived(), (null)(null);
