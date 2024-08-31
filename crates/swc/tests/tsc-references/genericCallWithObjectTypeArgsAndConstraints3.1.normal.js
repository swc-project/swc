//// [genericCallWithObjectTypeArgsAndConstraints3.ts]
// Generic call with constraints infering type parameter from object member properties
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
function f(a) {
    var r;
    return r;
}
var r1 = f({
    x: new Derived(),
    y: new Derived2()
}); // error because neither is supertype of the other
function f2(a) {
    var r;
    return r;
}
var r2 = f2({
    x: new Derived(),
    y: new Derived2()
}); // ok
var r3 = f2({
    x: new Derived(),
    y: new Derived2()
}); // ok
function f3(y, x) {
    return y(null);
}
// all ok - second argument is processed before x is fixed
var r4 = f3(function(x) {
    return x;
}, new Base());
var r5 = f3(function(x) {
    return x;
}, new Derived());
var r6 = f3(function(x) {
    return x;
}, null);
