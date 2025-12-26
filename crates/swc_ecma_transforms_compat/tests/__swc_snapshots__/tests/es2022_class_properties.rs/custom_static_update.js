var _x = new WeakMap();
var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
    }
    _create_class(Foo, [
        {
            key: "test",
            value: function test() {
                var _Foo, _Foo1, _Foo2, _Foo3, _Foo4;
                _Foo = Foo, _Foo1 = _class_private_field_get(_Foo, _x), _class_private_field_set(_Foo, _x, _Foo1 + (typeof _Foo1 === "bigint" ? 1n : 1)), _Foo1;
                _Foo2 = Foo, _Foo3 = (_Foo4 = _class_private_field_get(_Foo2, _x)) + (typeof _Foo4 === "bigint" ? 1n : 1), _class_private_field_set(_Foo2, _x, _Foo3), _Foo3;
            }
        }
    ]);
    return Foo;
}();
_x.set(Foo, {
    writable: true,
    value: 0
});
