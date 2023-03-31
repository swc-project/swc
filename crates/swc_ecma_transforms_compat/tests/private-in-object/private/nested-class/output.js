var _foo = /*#__PURE__*/ new WeakMap();
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
            value: function test() {
                let Nested = /*#__PURE__*/ function() {
                    function Nested() {
                        _class_call_check(this, Nested);
                    }
                    _create_class(Nested, [
                        {
                            key: "test",
                            value: function test() {
                                _foo.has(this);
                            }
                        }
                    ]);
                    return Nested;
                }();
                _foo.has(this);
            }
        }
    ]);
    return Foo;
}();
