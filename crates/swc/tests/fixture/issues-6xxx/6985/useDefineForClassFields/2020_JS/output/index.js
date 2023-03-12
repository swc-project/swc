import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
var _b = /*#__PURE__*/ new WeakMap();
class Foo {
    constructor(){
        _define_property(this, "a", 1);
        _class_private_field_init(this, _b, {
            writable: true,
            value: 2
        });
    }
}
_define_property(Foo, "c", 3);
var _d = {
    writable: true,
    value: 4
};
