var _foo = new WeakMap();
let Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
        _class_private_field_init(this, _foo, {
            writable: true,
            value: 1
        });
    }
    _create_class(Foo, [
        {
            key: "test",
            value: function test(other) {
                return _brand_check_foo.has(other);
            }
        }
    ]);
    return Foo;
}();
