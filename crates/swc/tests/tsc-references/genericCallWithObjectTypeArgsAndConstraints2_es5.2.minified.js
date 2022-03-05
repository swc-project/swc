import * as swcHelpers from "@swc/helpers";
var Base = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
}, Derived = function(Base1) {
    "use strict";
    swcHelpers.inherits(Derived, Base1);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        return swcHelpers.classCallCheck(this, Derived), _super.apply(this, arguments);
    }
    return Derived;
}(Base);
function f(x) {}
function f3(x, y) {
    return y(null);
}
f({
    foo: new Base(),
    bar: new Derived()
}), f({
    foo: new Derived(),
    bar: new Derived()
}), f3(new Base(), function(x) {
    return x;
}), f3(new Derived(), function(x) {
    return x;
}), f3(null, null), f3(null, function(x) {
    return x;
});
