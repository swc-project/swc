import _assert_this_initialized from "@swc/helpers/lib/_assert_this_initialized.js";
import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_field_set from "@swc/helpers/lib/_class_private_field_set.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var _foo = new WeakMap(), A = function() {
    "use strict";
    _class_call_check(this, A), _class_private_field_init(this, _foo, {
        writable: !0,
        value: void 0
    }), _class_private_field_set(this, _foo, 3);
}, _foo1 = new WeakMap(), B = function(A1) {
    "use strict";
    _inherits(B, A1);
    var _super = _create_super(B);
    function B() {
        var _this;
        return _class_call_check(this, B), _class_private_field_init(_assert_this_initialized(_this = _super.call(this)), _foo1, {
            writable: !0,
            value: void 0
        }), _class_private_field_set(_assert_this_initialized(_this), _foo1, "some string"), _this;
    }
    return B;
}(A);
