var _class_private_field_init = require("@swc/helpers/_/_class_private_field_init");
var _class_private_field_set = require("@swc/helpers/_/_class_private_field_set");
var _define_property = require("@swc/helpers/_/_define_property");
var _b = /*#__PURE__*/ new WeakMap();
class Foo {
    constructor(foo){
        _define_property._(this, "foo", void 0);
        _define_property._(this, "a", void 0);
        _class_private_field_init._(this, _b, {
            writable: true,
            value: void 0
        });
        this.foo = foo;
        this.a = 1;
        _class_private_field_set._(this, _b, 2);
    }
}
_define_property._(Foo, "c", 3);
var _d = {
    writable: true,
    value: 4
};
