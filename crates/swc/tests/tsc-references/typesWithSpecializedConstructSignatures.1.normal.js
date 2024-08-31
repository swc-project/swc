//// [typesWithSpecializedConstructSignatures.ts]
// basic uses of specialized signatures without errors
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
var Derived1 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived1, Base);
    function Derived1() {
        _class_call_check(this, Derived1);
        return _call_super(this, Derived1, arguments);
    }
    return Derived1;
}(Base);
var Derived2 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived2, Base);
    function Derived2() {
        _class_call_check(this, Derived2);
        return _call_super(this, Derived2, arguments);
    }
    return Derived2;
}(Base);
var C = function C(x) {
    "use strict";
    _class_call_check(this, C);
    return x;
};
var c = new C('a');
var i;
var a;
c = i;
c = a;
i = a;
a = i;
var r1 = new C('hi');
var r2 = new i('bye');
var r3 = new a('hm');
