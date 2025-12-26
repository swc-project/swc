import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _b = new WeakMap(), __ = new WeakMap(), _d = new WeakMap();
class Foo {
    constructor(){
        _class_private_field_init(this, _b, {
            writable: true,
            value: void 0
        });
        this.a = 1;
        _class_private_field_set(this, _b, 2);
    }
}
__.set(Foo, {
    writable: true,
    value: Foo.c = 3
});
_d.set(Foo, {
    writable: true,
    value: 4
});
