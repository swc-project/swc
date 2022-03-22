import * as swcHelpers from "@swc/helpers";
var Base = function Base(n) {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
    this.x = 43;
};
function v() {}
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived(q) {
        swcHelpers.classCallCheck(this, Derived);
        var _this;
        _this = _super.call(this, "");
        _this.q = q;
        var _temp;
        //type of super call expression is void
        var p = (_temp = _this = _super.call(this, ""), _this.q = q, _temp);
        var p = v();
        return _this;
    }
    return Derived;
}(Base);
var OtherBase = function OtherBase() {
    "use strict";
    swcHelpers.classCallCheck(this, OtherBase);
};
var OtherDerived = /*#__PURE__*/ function(OtherBase) {
    "use strict";
    swcHelpers.inherits(OtherDerived, OtherBase);
    var _super = swcHelpers.createSuper(OtherDerived);
    function OtherDerived() {
        swcHelpers.classCallCheck(this, OtherDerived);
        var p = "";
        return _super.call(this);
    }
    return OtherDerived;
}(OtherBase);
