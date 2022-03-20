import * as swcHelpers from "@swc/helpers";
var Base = function(n) {
    "use strict";
    swcHelpers.classCallCheck(this, Base), this.x = 43;
}, Derived = function(Base1) {
    "use strict";
    swcHelpers.inherits(Derived, Base1);
    var _super = swcHelpers.createSuper(Derived);
    function Derived(q) {
        var _this;
        return swcHelpers.classCallCheck(this, Derived), (_this = _super.call(this, "")).q = q, (_this = _super.call(this, "")).q = q, _this;
    }
    return Derived;
}(Base), OtherBase = function() {
    "use strict";
    swcHelpers.classCallCheck(this, OtherBase);
}, OtherDerived = function(OtherBase1) {
    "use strict";
    swcHelpers.inherits(OtherDerived, OtherBase1);
    var _super = swcHelpers.createSuper(OtherDerived);
    function OtherDerived() {
        return swcHelpers.classCallCheck(this, OtherDerived), _super.call(this);
    }
    return OtherDerived;
}(OtherBase);
