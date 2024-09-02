//// [derivedClassOverridesProtectedMembers.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var x;
var y;
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base(a) {
        _class_call_check(this, Base);
    }
    var _proto = Base.prototype;
    _proto.b = function b(a) {};
    Base.s = function s(a) {};
    _create_class(Base, [
        {
            key: "c",
            get: function get() {
                return x;
            },
            set: function set(v) {}
        }
    ], [
        {
            key: "t",
            get: function get() {
                return x;
            },
            set: function set(v) {}
        }
    ]);
    return Base;
}();
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    function Derived(a) {
        _class_call_check(this, Derived);
        return _call_super(this, Derived, [
            x
        ]);
    }
    var _proto = Derived.prototype;
    _proto.b = function b(a) {};
    Derived.s = function s(a) {};
    _create_class(Derived, [
        {
            key: "c",
            get: function get() {
                return y;
            },
            set: function set(v) {}
        }
    ], [
        {
            key: "t",
            get: function get() {
                return y;
            },
            set: function set(a) {}
        }
    ]);
    return Derived;
}(Base);
