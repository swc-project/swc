//// [derivedClassIncludesInheritedMembers.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var d2, Derived = function(Base) {
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        return _class_call_check(this, Derived), _super.apply(this, arguments);
    }
    return Derived;
}(function() {
    function Base(x) {
        _class_call_check(this, Base);
    }
    return Base.prototype.b = function() {}, Base.s = function() {}, _create_class(Base, [
        {
            key: "c",
            get: function() {
                return '';
            },
            set: function(v) {}
        }
    ], [
        {
            key: "t",
            get: function() {
                return '';
            },
            set: function(v) {}
        }
    ]), Base;
}()), d = new Derived(1);
d.a, d.b(), d.c, d.c = '', Derived.r, Derived.s(), Derived.t, Derived.t = '', d2[''], d2[1];
