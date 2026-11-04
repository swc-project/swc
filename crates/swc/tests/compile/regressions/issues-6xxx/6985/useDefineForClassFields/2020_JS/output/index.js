import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
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
