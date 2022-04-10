import * as swcHelpers from "@swc/helpers";
var Base = function() {
    swcHelpers.classCallCheck(this, Base);
}, Derived = function(Base1) {
    swcHelpers.inherits(Derived, Base1);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        return swcHelpers.classCallCheck(this, Derived), _super.apply(this, arguments);
    }
    return Derived;
}(Base);
function f3(x, y) {
    return y(null);
}
new Base(), new Derived(), new Derived(), new Derived(), f3(new Base(), function(x) {
    return x;
}), f3(new Derived(), function(x) {
    return x;
}), f3(null, null), f3(null, function(x) {
    return x;
});
