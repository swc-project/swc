import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var d, Base = function(p) {
    "use strict";
    _class_call_check(this, Base), this.p = p;
}, Derived = function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived(p) {
        var _this;
        return _class_call_check(this, Derived), (_this = _super.call(this, p)).p = p, _this.p, _this;
    }
    return Derived;
}(Base);
d.p;
