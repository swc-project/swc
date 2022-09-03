//// [superPropertyInConstructorBeforeSuperCall.ts]
import _assert_this_initialized from "@swc/helpers/src/_assert_this_initialized.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _possible_constructor_return from "@swc/helpers/src/_possible_constructor_return.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var B = function() {
    "use strict";
    function B(x) {
        _class_call_check(this, B);
    }
    return B.prototype.x = function() {
        return "";
    }, B;
}(), C1 = function(B) {
    "use strict";
    _inherits(C1, B);
    var _super = _create_super(C1);
    function C1() {
        var _this;
        return _class_call_check(this, C1), _get((_assert_this_initialized(_this), _get_prototype_of(C1.prototype)), "x", _this).call(_this), _possible_constructor_return(_this = _super.call(this));
    }
    return C1;
}(B), C2 = function(B) {
    "use strict";
    _inherits(C2, B);
    var _super = _create_super(C2);
    function C2() {
        return _class_call_check(this, C2), _super.call(this, _get(_get_prototype_of(C2.prototype), "x", this).call(this));
    }
    return C2;
}(B);
