//// [genericCallWithObjectTypeArgs2.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    function Derived() {
        _class_call_check(this, Derived);
        return _call_super(this, Derived, arguments);
    }
    return Derived;
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
// returns {}[]
function f(a) {
    return [
        a.x,
        a.y
    ];
}
var r = f({
    x: new Derived(),
    y: new Derived2()
}); // {}[]
var r2 = f({
    x: new Base(),
    y: new Derived2()
}); // {}[]
function f2(a) {
    return function(x) {
        return a.y;
    };
}
var r3 = f2({
    x: new Derived(),
    y: new Derived2()
}); // Derived => Derived2
var i;
var r4 = f2(i); // Base => Derived
