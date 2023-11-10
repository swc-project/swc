export var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
    }
    _create_class(Foo, [
        {
            key: "func",
            value: function func(a) {
                var b = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Date.now();
                return {
                    a: a
                };
            }
        }
    ]);
    return Foo;
}();
