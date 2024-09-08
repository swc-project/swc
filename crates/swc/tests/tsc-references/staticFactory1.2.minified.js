//// [staticFactory1.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
/*#__PURE__*/ (function(Base) {
    function Derived() {
        return _class_call_check(this, Derived), _call_super(this, Derived, arguments);
    }
    return _inherits(Derived, Base), Derived.prototype.foo = function() {
        return 2;
    }, Derived;
})(/*#__PURE__*/ function() {
    function Base() {
        _class_call_check(this, Base);
    }
    return Base.prototype.foo = function() {
        return 1;
    }, Base.create = function() {
        return new this();
    }, Base;
}()).create().foo();
