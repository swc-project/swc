import * as swcHelpers from "@swc/helpers";
var Base = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Base), this.a = 1;
}, Derived = function(Base1) {
    "use strict";
    swcHelpers.inherits(Derived, Base1);
    var _super = swcHelpers.createSuper(Derived);
    function Derived(a) {
        var _this;
        return swcHelpers.classCallCheck(this, Derived), (_this = _super.call(this)).a = a, _this.b = _this.a, _this;
    }
    return Derived;
}(Base);
