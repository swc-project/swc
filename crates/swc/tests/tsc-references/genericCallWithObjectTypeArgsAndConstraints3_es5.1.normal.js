import * as swcHelpers from "@swc/helpers";
// Generic call with constraints infering type parameter from object member properties
var Base = function Base() {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        swcHelpers.classCallCheck(this, Derived);
        return _super.apply(this, arguments);
    }
    return Derived;
}(Base);
var Derived2 = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived2, Base);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2() {
        swcHelpers.classCallCheck(this, Derived2);
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
