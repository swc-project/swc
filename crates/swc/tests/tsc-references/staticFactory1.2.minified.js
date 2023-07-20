//// [staticFactory1.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
(function(Base) {
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        return _class_call_check(this, Derived), _super.apply(this, arguments);
    }
    return Derived.prototype.foo = function() {
        return 2;
    }, Derived;
})(function() {
    function Base() {
        _class_call_check(this, Base);
    }
    return Base.prototype.foo = function() {
        return 1;
    }, Base.create = function() {
        return new this();
    }, Base;
}()).create().foo();
