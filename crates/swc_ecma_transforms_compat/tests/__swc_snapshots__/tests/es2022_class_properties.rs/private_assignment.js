var _foo = new WeakMap();
var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
        _class_private_field_init(this, _foo, {
            writable: true,
            value: 0
        });
    }
    _create_class(Foo, [
        {
            key: "test",
            value: function test(other) {
                var _this, _other_obj;
                _this = this, _class_private_field_set(_this, _foo, _class_private_field_get(_this, _foo) + 1);
                _class_private_field_set(this, _foo, 2);
                _other_obj = other.obj, _class_private_field_set(_other_obj, _foo, _class_private_field_get(_other_obj, _foo) + 1);
                _class_private_field_set(other.obj, _foo, 2);
            }
        }
    ]);
    return Foo;
}();
