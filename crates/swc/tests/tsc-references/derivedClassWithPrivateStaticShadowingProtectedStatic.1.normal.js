//// [derivedClassWithPrivateStaticShadowingProtectedStatic.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base() {
        _class_call_check(this, Base);
    }
    Base.fn = function fn() {
        return '';
    };
    _create_class(Base, null, [
        {
            key: "a",
            get: function get() {
                return 1;
            },
            set: function set(v) {}
        }
    ]);
    return Base;
}();
// should be error
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    function Derived() {
        _class_call_check(this, Derived);
        return _call_super(this, Derived, arguments);
    }
    Derived.fn = function fn() {
        return '';
    };
    _create_class(Derived, null, [
        {
            key: "a",
            get: function get() {
                return 1;
            },
            set: function set(v) {}
        }
    ]);
    return Derived;
}(Base);
