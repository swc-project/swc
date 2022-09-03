//// [superCalls.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Base = function Base(n) {
    "use strict";
    _class_call_check(this, Base), this.x = 43;
};
function v() {}
var Derived = function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived(q) {
        var _this;
        return _class_call_check(this, Derived), (_this = _super.call(this, "")).q = q, (_this = _super.call(this, "")).q = q, v(), _this;
    }
    return Derived;
}(Base), OtherBase = function OtherBase() {
    "use strict";
    _class_call_check(this, OtherBase);
}, OtherDerived = function(OtherBase) {
    "use strict";
    _inherits(OtherDerived, OtherBase);
    var _super = _create_super(OtherDerived);
    function OtherDerived() {
        return _class_call_check(this, OtherDerived), _super.call(this);
    }
    return OtherDerived;
}(OtherBase);
