import _assert_this_initialized from "@swc/helpers/src/_assert_this_initialized.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var _foo = /*#__PURE__*/ new WeakMap();
// @strict: true
// @target: es6
var A = function A() {
    "use strict";
    _class_call_check(this, A);
    _class_private_field_init(this, _foo, {
        writable: true,
        value: void 0
    });
    _class_private_field_set(this, _foo, 3);
};
var _foo1 = /*#__PURE__*/ new WeakMap();
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        _class_call_check(this, B);
        var _this;
        _this = _super.call(this);
        _class_private_field_init(_assert_this_initialized(_this), _foo1, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(_assert_this_initialized(_this), _foo1, "some string");
        return _this;
    }
    return B;
}(A);
