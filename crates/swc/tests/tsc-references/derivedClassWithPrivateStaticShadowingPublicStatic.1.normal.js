//// [derivedClassWithPrivateStaticShadowingPublicStatic.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
// BUG 847404
// should be error
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        _class_call_check(this, Derived);
        return _super.apply(this, arguments);
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
var r = Base.x; // ok
var r2 = Derived.x; // error
var r3 = Base.fn(); // ok
var r4 = Derived.fn(); // error
var r5 = Base.a; // ok
Base.a = 2; // ok
var r6 = Derived.a; // error
Derived.a = 2; // error
