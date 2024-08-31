//// [genericCallWithObjectTypeArgsAndConstraints2.ts]
// Generic call with constraints infering type parameter from object member properties
// No errors expected
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
function f(x) {
    var r;
    return r;
}
var r = f({
    foo: new Base(),
    bar: new Derived()
});
var r2 = f({
    foo: new Derived(),
    bar: new Derived()
});
function f2(x) {
    var r;
    return r;
}
var i;
var r3 = f2(i);
function f3(x, y) {
    return y(null);
}
var r4 = f3(new Base(), function(x) {
    return x;
});
var r5 = f3(new Derived(), function(x) {
    return x;
});
var r6 = f3(null, null); // any
var r7 = f3(null, function(x) {
    return x;
}); // any
