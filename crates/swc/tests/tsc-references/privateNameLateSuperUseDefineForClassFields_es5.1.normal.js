import _assert_this_initialized from "@swc/helpers/src/_assert_this_initialized.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// @target: esnext, es2022
// @useDefineForClassFields: true
var B = function B() {
    "use strict";
    _class_call_check(this, B);
};
var _x = /*#__PURE__*/ new WeakMap();
var A = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(A, B);
    var _super = _create_super(A);
    function A() {
        _class_call_check(this, A);
        var _this;
        void 0;
        _this = _super.call(this);
        _class_private_field_init(_assert_this_initialized(_this), _x, {
            writable: true,
            value: void 0
        });
        return _this;
    }
    return A;
}(B);
