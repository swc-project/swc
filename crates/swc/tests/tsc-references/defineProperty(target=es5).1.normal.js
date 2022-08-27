//// [defineProperty.ts]
import _assert_this_initialized from "@swc/helpers/src/_assert_this_initialized.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var x = "p";
var _x = x;
var __x = _x;
var A = /*#__PURE__*/ function() {
    "use strict";
    function A(y) {
        _class_call_check(this, A);
        _define_property(this, "a", void 0);
        _define_property(this, "b", void 0);
        _define_property(this, "c", void 0);
        _define_property(this, "computed", void 0);
        _define_property(this, __x, void 0);
        _define_property(this, "z", void 0);
        _define_property(this, "y", void 0);
        this.y = y;
        this.a = this.y;
        this["computed"] = 13;
        this[_x] = 14;
        this.z = this.y;
    }
    _create_class(A, [
        {
            key: "m",
            value: function m() {}
        }
    ]);
    return A;
}();
var B = function B() {
    "use strict";
    _class_call_check(this, B);
    _define_property(this, "a", void 0);
};
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _create_super(C);
    function C(ka) {
        _class_call_check(this, C);
        var _this;
        _this = _super.call(this);
        _define_property(_assert_this_initialized(_this), "z", void 0);
        _define_property(_assert_this_initialized(_this), "ki", void 0);
        _define_property(_assert_this_initialized(_this), "ka", void 0);
        _this.ka = ka;
        _this.z = _this.ka;
        _this.ki = _this.ka;
        return _this;
    }
    return C;
}(B);
