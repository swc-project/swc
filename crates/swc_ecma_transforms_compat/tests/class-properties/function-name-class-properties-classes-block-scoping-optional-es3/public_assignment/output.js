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
                this.foo += 1;
                this.foo = 2;
                other.obj.foo++;
                other.obj.foo += 1;
                other.obj.foo = 2;
            }
        }
    ]);
    return Foo;
}();
