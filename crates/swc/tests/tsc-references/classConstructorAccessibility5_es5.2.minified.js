import * as swcHelpers from "@swc/helpers";
var Base = function() {
    swcHelpers.classCallCheck(this, Base);
}, Derived = function(Base1) {
    swcHelpers.inherits(Derived, Base1);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        return swcHelpers.classCallCheck(this, Derived), _super.apply(this, arguments);
    }
    return Derived.make = function() {
        new Base();
    }, Derived;
}(Base), Unrelated = function() {
    function Unrelated() {
        swcHelpers.classCallCheck(this, Unrelated);
    }
    return Unrelated.fake = function() {
        new Base();
    }, Unrelated;
}();
