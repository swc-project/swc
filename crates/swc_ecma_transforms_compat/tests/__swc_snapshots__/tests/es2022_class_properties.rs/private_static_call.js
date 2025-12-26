var _foo = new WeakMap();
var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
    }
    _create_class(Foo, [
        {
            key: "test",
            value: function test(x) {
                var _Foo;
                return _Foo = Foo, _class_private_field_get(_Foo, _foo).call(_Foo, x);
            }
        }
    ]);
    return Foo;
}();
_foo.set(Foo, {
    writable: true,
    value: function(x) {
        return x;
    }
});
