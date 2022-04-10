import * as swcHelpers from "@swc/helpers";
var Base = function() {
    swcHelpers.classCallCheck(this, Base);
}, Derived = function(Base1) {
    swcHelpers.inherits(Derived, Base1);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        var _this;
        return swcHelpers.classCallCheck(this, Derived), _this = _super.apply(this, arguments), _this.bing = function() {
            return Base.foo;
        }, _this;
    }
    return Derived;
}(Base);
Derived.bar = Base.foo;
