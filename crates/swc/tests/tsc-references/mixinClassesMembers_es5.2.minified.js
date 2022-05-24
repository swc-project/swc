import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _get from "@swc/helpers/lib/_get.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var C2 = function(Mixed1) {
    "use strict";
    _inherits(C2, Mixed1);
    var _super = _create_super(C2);
    function C2() {
        var _this;
        return _class_call_check(this, C2), (_this = _super.call(this, "hello")).a, _this.b, _this.p, _this;
    }
    return C2;
}(Mixed1), C3 = function(Mixed3) {
    "use strict";
    _inherits(C3, Mixed3);
    var _super = _create_super(C3);
    function C3() {
        var _this;
        return _class_call_check(this, C3), (_this = _super.call(this, 42)).a, _this.b, _this.p, _this.f(), _this;
    }
    return C3.prototype.f = function() {
        return _get(_get_prototype_of(C3.prototype), "f", this).call(this);
    }, C3;
}(Mixed3);
