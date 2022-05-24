import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var Base = function Base(n) {
    "use strict";
    _class_call_check(this, Base);
    this.x = 43;
};
function v() {}
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived(q) {
        _class_call_check(this, Derived);
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
    _class_call_check(this, OtherBase);
};
var OtherDerived = /*#__PURE__*/ function(OtherBase) {
    "use strict";
    _inherits(OtherDerived, OtherBase);
    var _super = _create_super(OtherDerived);
    function OtherDerived() {
        _class_call_check(this, OtherDerived);
        var p = "";
        return _super.call(this);
    }
    return OtherDerived;
}(OtherBase);
