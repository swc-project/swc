//// [derivedClassWithPrivateInstanceShadowingPublicInstance.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var Base = function() {
    function Base() {
        _class_call_check(this, Base);
    }
    return Base.prototype.fn = function() {
        return "";
    }, _create_class(Base, [
        {
            key: "a",
            get: function() {
                return 1;
            },
            set: function(v) {}
        }
    ]), Base;
}(), // error, not a subtype
Derived = function(Base) {
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        return _class_call_check(this, Derived), _super.apply(this, arguments);
    }
    return Derived.prototype.fn = function() {
        return "";
    }, _create_class(Derived, [
        {
            key: "a",
            get: function() {
                return 1;
            },
            set: function(v) {}
        }
    ]), Derived;
}(Base);
Base.x, Derived.x, Base.fn(), Derived.fn(), Base.a, Base.a = 2, Derived.a, Derived.a = 2;
 // error
