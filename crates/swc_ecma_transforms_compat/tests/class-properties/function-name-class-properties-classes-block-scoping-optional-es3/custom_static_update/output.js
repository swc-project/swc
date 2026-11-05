var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
    }
    _create_class(Foo, [
        {
            key: "test",
            value: function test() {
                _class_static_private_field_update(Foo, Foo, _x).value++;
                ++_class_static_private_field_update(Foo, Foo, _x).value;
            }
        }
    ]);
    return Foo;
}();
var _x = {
    writable: true,
    value: 0
};
