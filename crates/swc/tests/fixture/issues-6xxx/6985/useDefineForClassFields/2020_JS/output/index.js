var _class_private_field_init = require("@swc/helpers/_/_class_private_field_init");
var _define_property = require("@swc/helpers/_/_define_property");
var _b = /*#__PURE__*/ new WeakMap();
class Foo {
    constructor(){
        _define_property._(this, "a", 1);
        _class_private_field_init._(this, _b, {
            writable: true,
            value: 2
        });
    }
}
_define_property._(Foo, "c", 3);
var _d = {
    writable: true,
    value: 4
};
