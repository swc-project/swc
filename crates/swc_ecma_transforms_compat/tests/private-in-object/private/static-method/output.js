let Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
    }
    _create_class(Foo, [
        {
            key: "test",
            value: function test(other) {
                return other === Foo;
            }
        }
    ]);
    return Foo;
}();
function foo() {}
