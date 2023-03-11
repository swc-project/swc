import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
var _b = /*#__PURE__*/ new WeakMap();
class Foo {
    constructor(foo){
        _define_property(this, "foo", void 0);
        _define_property(this, "a", void 0);
        _class_private_field_init(this, _b, {
            writable: true,
            value: void 0
        });
        this.foo = foo;
        this.a = 1;
        _class_private_field_set(this, _b, 2);
    }
}
_define_property(Foo, "c", 3);
var _d = {
    writable: true,
    value: 4
};
