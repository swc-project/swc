var _foo = new WeakMap();
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
function get_foo() {}
_foo.set(Foo, {
    get: get_foo,
    set: void 0
});
