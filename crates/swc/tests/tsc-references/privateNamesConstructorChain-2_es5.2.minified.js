import _assert_this_initialized from "@swc/helpers/lib/_assert_this_initialized.js";
import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_static_private_field_spec_get from "@swc/helpers/lib/_class_static_private_field_spec_get.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var _foo = new WeakMap(), Parent = function() {
    "use strict";
    function Parent() {
        _class_call_check(this, Parent), _class_private_field_init(this, _foo, {
            writable: !0,
            value: 3
        });
    }
    return Parent.prototype.accessChildProps = function() {
        _class_private_field_get(new Child(), _foo), _class_static_private_field_spec_get(Child, Parent, _bar);
    }, Parent;
}(), _bar = {
    writable: !0,
    value: 5
}, _foo1 = new WeakMap(), _bar1 = new WeakMap(), Child = function(Parent) {
    "use strict";
    _inherits(Child, Parent);
    var _super = _create_super(Child);
    function Child() {
        var _this;
        return _class_call_check(this, Child), _this = _super.apply(this, arguments), _class_private_field_init(_assert_this_initialized(_this), _foo1, {
            writable: !0,
            value: "foo"
        }), _class_private_field_init(_assert_this_initialized(_this), _bar1, {
            writable: !0,
            value: "bar"
        }), _this;
    }
    return Child;
}(Parent);
new Parent().accessChildProps();
