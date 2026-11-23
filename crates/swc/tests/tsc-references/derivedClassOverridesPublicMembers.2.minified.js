//// [derivedClassOverridesPublicMembers.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Derived = /*#__PURE__*/ function(Base) {
    function Derived(a) {
        return _class_call_check(this, Derived), _call_super(this, Derived, [
            void 0
        ]);
    }
    return _inherits(Derived, Base), Derived.prototype.b = function(a) {}, Derived.s = function(a) {}, _create_class(Derived, [
        {
            key: "c",
            get: function() {},
            set: function(v) {}
        }
    ], [
        {
            key: "t",
            get: function() {},
            set: function(a) {}
        }
    ]), Derived;
}(/*#__PURE__*/ function() {
    function Base(a) {
        _class_call_check(this, Base);
    }
    return Base.prototype.b = function(a) {}, Base.s = function(a) {}, _create_class(Base, [
        {
            key: "c",
            get: function() {},
            set: function(v) {}
        }
    ], [
        {
            key: "t",
            get: function() {},
            set: function(v) {}
        }
    ]), Base;
}()), d = new Derived(void 0);
d.a, d.b(void 0), d.c, d.d, d.c = void 0, Derived.r, Derived.s(void 0), Derived.t, Derived.u, Derived.t = void 0, (void 0)[''], (void 0)[1];
