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
    var _proto = Derived.prototype;
    return _proto.foo = function() {
        return 2;
    }, Derived;
})(function() {
    function Base() {
        _class_call_check(this, Base);
    }
    var _proto = Base.prototype;
    return _proto.foo = function() {
        return 1;
    }, Base.create = function() {
        return new this();
    }, Base;
}()).create().foo();
