var _x = /*#__PURE__*/ new WeakMap();
var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
        _class_private_field_init(this, _x, {
            writable: true,
            value: 0
        });
    }
    _create_class(Foo, [
        {
            key: "test",
            value: function test() {
                _class_private_field_update(this, _x).value++;
                ++_class_private_field_update(this, _x).value;
            }
        }
    ]);
    return Foo;
}();
