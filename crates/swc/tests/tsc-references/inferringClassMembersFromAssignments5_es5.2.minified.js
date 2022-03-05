import * as swcHelpers from "@swc/helpers";
var Base = function() {
    "use strict";
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    return swcHelpers.createClass(Base, [
        {
            key: "m",
            value: function() {
                this.p = 1;
            }
        }
    ]), Base;
}(), Derived = function(Base) {
    "use strict";
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        var _this;
        return swcHelpers.classCallCheck(this, Derived), (_this = _super.call(this)).p = 1, _this;
    }
    return swcHelpers.createClass(Derived, [
        {
            key: "test",
            value: function() {
                return this.p;
            }
        }
    ]), Derived;
}(Base);
