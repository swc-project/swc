var _x = /*#__PURE__*/ new WeakMap();
var C = function C() {
    "use strict";
    _class_call_check(this, C);
    _define_property(this, "y", _class_private_field_get(this, _x));
    _class_private_field_init(this, _x, {
        writable: true,
        value: void 0
    });
};
expect(()=>{
    new C();
}).toThrow();
