import * as swcHelpers from "@swc/helpers";
var d, Base = function(p) {
    "use strict";
    swcHelpers.classCallCheck(this, Base), this.p = p;
}, Derived = function(Base1) {
    "use strict";
    swcHelpers.inherits(Derived, Base1);
    var _super = swcHelpers.createSuper(Derived);
    function Derived(p) {
        var _this;
        return swcHelpers.classCallCheck(this, Derived), (_this = _super.call(this, p)).p = p, _this.p, _this;
    }
    return Derived;
}(Base);
d.p;
