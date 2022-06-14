import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// Generic call with constraints infering type parameter from object member properties
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        _class_call_check(this, Derived);
        return _super.apply(this, arguments);
    }
    return Derived;
}(Base);
var Derived2 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived2, Base);
    var _super = _create_super(Derived2);
    function Derived2() {
        _class_call_check(this, Derived2);
        return _super.apply(this, arguments);
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
