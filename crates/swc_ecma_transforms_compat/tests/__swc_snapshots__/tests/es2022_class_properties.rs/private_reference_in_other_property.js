var _two = new WeakMap(), _private = new WeakMap(), _four = new WeakMap();
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
    _define_property(this, "one", _class_private_field_get(this, _private));
    _class_private_field_init(this, _two, {
        writable: true,
        value: _class_private_field_get(this, _private)
    });
    _class_private_field_init(this, _private, {
        writable: true,
        value: 0
    });
    _define_property(this, "three", _class_private_field_get(this, _private));
    _class_private_field_init(this, _four, {
        writable: true,
        value: _class_private_field_get(this, _private)
    });
};
