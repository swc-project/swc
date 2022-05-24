import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var Base = function(n) {
    "use strict";
    _class_call_check(this, Base), this.x = 43;
}, Derived = function(Base1) {
    "use strict";
    _inherits(Derived, Base1);
    var _super = _create_super(Derived);
    function Derived(q) {
        var _this;
        return _class_call_check(this, Derived), (_this = _super.call(this, "")).q = q, (_this = _super.call(this, "")).q = q, _this;
    }
    return Derived;
}(Base), OtherBase = function() {
    "use strict";
    _class_call_check(this, OtherBase);
}, OtherDerived = function(OtherBase1) {
    "use strict";
    _inherits(OtherDerived, OtherBase1);
    var _super = _create_super(OtherDerived);
    function OtherDerived() {
        return _class_call_check(this, OtherDerived), _super.call(this);
    }
    return OtherDerived;
}(OtherBase);
