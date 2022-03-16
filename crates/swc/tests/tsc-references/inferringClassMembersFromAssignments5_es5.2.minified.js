import * as swcHelpers from "@swc/helpers";
var Base = function() {
    "use strict";
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    return Base.prototype.m = function() {
        this.p = 1;
    }, Base;
}(), Derived = function(Base) {
    "use strict";
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        var _this;
        return swcHelpers.classCallCheck(this, Derived), (_this = _super.call(this)).p = 1, _this;
    }
    return Derived.prototype.test = function() {
        return this.p;
    }, Derived;
}(Base);
