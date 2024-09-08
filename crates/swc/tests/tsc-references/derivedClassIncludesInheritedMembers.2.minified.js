//// [derivedClassIncludesInheritedMembers.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var d2, Derived = /*#__PURE__*/ function(Base) {
    function Derived() {
        return _class_call_check(this, Derived), _call_super(this, Derived, arguments);
    }
    return _inherits(Derived, Base), Derived;
}(/*#__PURE__*/ function() {
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
