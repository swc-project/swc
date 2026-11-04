var foo = "bar";
var _bar = /*#__PURE__*/ new WeakMap(), _baz = /*#__PURE__*/ new WeakMap();
var Foo = function Foo(foo1) {
    "use strict";
    _class_call_check(this, Foo);
    _class_private_field_init(this, _bar, {
        writable: true,
        value: this
    });
    _class_private_field_init(this, _baz, {
        writable: true,
        value: foo
    });
};
