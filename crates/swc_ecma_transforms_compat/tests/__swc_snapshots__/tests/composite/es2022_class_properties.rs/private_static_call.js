var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
    }
    _create_class(Foo, [
        {
            key: "test",
            value: function test(x) {
                return _class_static_private_field_spec_get(Foo, Foo, _foo).call(Foo, x);
            }
        }
    ]);
    return Foo;
}();
var _foo = {
    writable: true,
    value: function(x) {
        return x;
    }
};
