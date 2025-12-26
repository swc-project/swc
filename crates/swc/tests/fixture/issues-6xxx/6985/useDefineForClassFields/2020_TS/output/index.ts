import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
var _b = new WeakMap(), _d = new WeakMap();
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
_d.set(Foo, {
    writable: true,
    value: 4
});
