//// [derivedClassWithPrivateInstanceShadowingPublicInstance.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Base = /*#__PURE__*/ function() {
    function Base() {
        _class_call_check(this, Base);
    }
    return Base.prototype.fn = function() {
        return '';
    }, _create_class(Base, [
        {
            key: "a",
            get: function() {
                return 1;
            },
            set: function(v) {}
        }
    ]), Base;
}(), Derived = /*#__PURE__*/ function(Base) {
    function Derived() {
        return _class_call_check(this, Derived), _call_super(this, Derived, arguments);
    }
    return _inherits(Derived, Base), Derived.prototype.fn = function() {
        return '';
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
