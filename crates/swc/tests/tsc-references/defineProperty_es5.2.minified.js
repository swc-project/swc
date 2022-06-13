import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var A = function() {
    "use strict";
    function A(y) {
        _class_call_check(this, A), this.y = y, this.a = this.y, this.computed = 13, this.p = 14, this.z = this.y;
    }
    return A.prototype.m = function() {}, A;
}(), B = function() {
    "use strict";
    _class_call_check(this, B);
}, C = function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C(ka) {
        var _this;
        return _class_call_check(this, C), (_this = _super.call(this)).ka = ka, _this.z = _this.ka, _this.ki = _this.ka, _this;
    }
    return C;
}(B);
