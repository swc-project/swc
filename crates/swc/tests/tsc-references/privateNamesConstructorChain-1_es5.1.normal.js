import _assert_this_initialized from "@swc/helpers/src/_assert_this_initialized.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_static_private_field_spec_get from "@swc/helpers/src/_class_static_private_field_spec_get.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var _foo = /*#__PURE__*/ new WeakMap();
// @target: es2015
var Parent = /*#__PURE__*/ function() {
    "use strict";
    function Parent() {
        _class_call_check(this, Parent);
        _class_private_field_init(this, _foo, {
            writable: true,
            value: 3
        });
    }
    var _proto = Parent.prototype;
    _proto.accessChildProps = function accessChildProps() {
        var _ref;
        _class_private_field_get(_ref = new Child(), _foo); // OK (`#foo` was added when `Parent`'s constructor was called on `child`)
        _class_static_private_field_spec_get(Child, Parent, _bar); // Error: not found
    };
    return Parent;
}();
var _bar = {
    writable: true,
    value: 5
};
var _foo1 = /*#__PURE__*/ new WeakMap(), _bar1 = /*#__PURE__*/ new WeakMap();
var Child = /*#__PURE__*/ function(Parent) {
    "use strict";
    _inherits(Child, Parent);
    var _super = _create_super(Child);
    function Child() {
        _class_call_check(this, Child);
        var _this;
        _this = _super.apply(this, arguments);
        _class_private_field_init(_assert_this_initialized(_this), _foo1, {
            writable: true,
            value: "foo"
        }) // OK (Child's #foo does not conflict, as `Parent`'s `#foo` is not accessible)
        ;
        _class_private_field_init(_assert_this_initialized(_this), _bar1, {
            writable: true,
            value: "bar"
        }) // OK
        ;
        return _this;
    }
    return Child;
}(Parent);
