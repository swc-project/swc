import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var d, Base = function(p) {
    "use strict";
    _class_call_check(this, Base), this.p = p;
}, Derived = function(Base1) {
    "use strict";
    _inherits(Derived, Base1);
    var _super = _create_super(Derived);
    function Derived(p) {
        var _this;
        return _class_call_check(this, Derived), (_this = _super.call(this, p)).p = p, _this.p, _this;
    }
    return Derived;
}(Base);
d.p;
