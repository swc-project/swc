//// [superPropertyInConstructorBeforeSuperCall.ts]
import _assert_this_initialized from "@swc/helpers/src/_assert_this_initialized.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _possible_constructor_return from "@swc/helpers/src/_possible_constructor_return.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var B = /*#__PURE__*/ function() {
    "use strict";
    function B(x) {
        _class_call_check(this, B);
    }
    var _proto = B.prototype;
    _proto.x = function x() {
        return "";
    };
    return B;
}();
var C1 = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C1, B);
    var _super = _create_super(C1);
    function C1() {
        _class_call_check(this, C1);
        var _this;
        _get((_assert_this_initialized(_this), _get_prototype_of(C1.prototype)), "x", _this).call(_this);
        _this = _super.call(this);
        return _possible_constructor_return(_this);
    }
    return C1;
}(B);
var C2 = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C2, B);
    var _super = _create_super(C2);
    function C2() {
        _class_call_check(this, C2);
        return _super.call(this, _get(_get_prototype_of(C2.prototype), "x", this).call(this));
    }
    return C2;
}(B);
