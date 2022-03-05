import * as swcHelpers from "@swc/helpers";
var Base = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Base), this.b = 1;
}, Derived = function(Base1) {
    "use strict";
    swcHelpers.inherits(Derived, Base1);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        var _this;
        return swcHelpers.classCallCheck(this, Derived), (_this = _super.call(this)).d = _this.b, _this.b = 2, _this;
    }
    return Derived;
}(Base);
