var _foo = /*#__PURE__*/ new WeakMap();
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
                var _other_obj;
                _class_private_field_set(this, _foo, _class_private_field_get(this, _foo) + 1);
                _class_private_field_set(this, _foo, 2);
                _class_private_field_set(_other_obj = other.obj, _foo, _class_private_field_get(_other_obj, _foo) + 1);
                _class_private_field_set(other.obj, _foo, 2);
            }
        }
    ]);
    return Foo;
}();
