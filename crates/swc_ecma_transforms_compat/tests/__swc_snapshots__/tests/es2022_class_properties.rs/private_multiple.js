var _x = /*#__PURE__*/ new WeakMap(), _y = /*#__PURE__*/ new WeakMap();
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
    _class_private_field_init(this, _x, {
        writable: true,
        value: 0
    });
    _class_private_field_init(this, _y, {
        writable: true,
        value: _class_private_field_get(this, _x)
    });
};
