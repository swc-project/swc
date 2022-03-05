import * as swcHelpers from "@swc/helpers";
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
function f(x) {
    var r1;
    return r1;
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
    var r8;
    return r8;
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
