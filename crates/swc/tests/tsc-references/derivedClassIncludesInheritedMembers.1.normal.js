//// [derivedClassIncludesInheritedMembers.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base(x) {
        _class_call_check(this, Base);
    }
    var _proto = Base.prototype;
    _proto.b = function b() {};
    Base.s = function s() {};
    _create_class(Base, [
        {
            key: "c",
            get: function get() {
                return '';
            },
            set: function set(v) {}
        }
    ], [
        {
            key: "t",
            get: function get() {
                return '';
            },
            set: function set(v) {}
        }
    ]);
    return Base;
}();
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    function Derived() {
        _class_call_check(this, Derived);
        return _call_super(this, Derived, arguments);
    }
    return Derived;
}(Base);
var d = new Derived(1);
var r1 = d.a;
var r2 = d.b();
var r3 = d.c;
d.c = '';
var r4 = Derived.r;
var r5 = Derived.s();
var r6 = Derived.t;
Derived.t = '';
var Base2 = function Base2() {
    "use strict";
    _class_call_check(this, Base2);
};
var Derived2 = /*#__PURE__*/ function(Base2) {
    "use strict";
    _inherits(Derived2, Base2);
    function Derived2() {
        _class_call_check(this, Derived2);
        return _call_super(this, Derived2, arguments);
    }
    return Derived2;
}(Base2);
var d2;
var r7 = d2[''];
var r8 = d2[1];
