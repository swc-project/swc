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
f({
    foo: new Base(),
    bar: new Derived()
}), f({
    foo: new Derived(),
    bar: new Derived()
}), function(x, y) {
    y(null);
}(new Base(), function(x) {
    return x;
}), function(x, y) {
    y(null);
}(new Derived(), function(x) {
    return x;
}), (null)(null), function(x, y) {
    y(null);
}(null, function(x) {
    return x;
});
