import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C2 = function(Mixed11) {
    "use strict";
    _inherits(C2, Mixed11);
    var _super = _create_super(C2);
    function C2() {
        var _this;
        return _class_call_check(this, C2), (_this = _super.call(this, "hello")).a, _this.b, _this.p, _this;
    }
    return C2;
}(Mixed1), C3 = function(Mixed31) {
    "use strict";
    _inherits(C3, Mixed31);
    var _super = _create_super(C3);
    function C3() {
        var _this;
        return _class_call_check(this, C3), (_this = _super.call(this, 42)).a, _this.b, _this.p, _this.f(), _this;
    }
    return C3.prototype.f = function() {
        return _get(_get_prototype_of(C3.prototype), "f", this).call(this);
    }, C3;
}(Mixed3);
