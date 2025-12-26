let Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
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
function foo() {}
