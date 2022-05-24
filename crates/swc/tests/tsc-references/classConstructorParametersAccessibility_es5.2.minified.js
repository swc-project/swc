import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var c2, c3, C1 = function(x) {
    "use strict";
    _class_call_check(this, C1), this.x = x;
};
(void 0).x;
var C2 = function(p) {
    "use strict";
    _class_call_check(this, C2), this.p = p;
};
c2.p;
var C3 = function(p) {
    "use strict";
    _class_call_check(this, C3), this.p = p;
};
c3.p;
var Derived = function(C31) {
    "use strict";
    _inherits(Derived, C31);
    var _super = _create_super(Derived);
    function Derived(p) {
        var _this;
        return _class_call_check(this, Derived), (_this = _super.call(this, p)).p, _this;
    }
    return Derived;
}(C3);
