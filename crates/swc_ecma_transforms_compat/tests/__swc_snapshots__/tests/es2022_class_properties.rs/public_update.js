var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
        _define_property(this, "foo", 0);
    }
    _create_class(Foo, [
        {
            key: "test",
            value: function test(other) {
                this.foo++;
                ++this.foo;
                other.obj.foo++;
                ++other.obj.foo;
            }
        }
    ]);
    return Foo;
}();
