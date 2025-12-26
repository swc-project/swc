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
                _class_private_field_update(this, _foo).value++;
                ++_class_private_field_update(this, _foo).value;
                _class_private_field_update(other.obj, _foo).value++;
                ++_class_private_field_update(other.obj, _foo).value;
            }
        }
    ]);
    return Foo;
}();
