//// [privateNamesUnique-3.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _foo = new WeakMap(), _foo = new WeakMap(), _foo1 = new WeakMap();
class A {
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _foo, 1);
    }
}
class B {
    test(x) {
        _class_private_field_get(x, _foo1); // error (#foo is a static property on B, not an instance property)
    }
}
_foo1.set(B, {
    writable: true,
    value: true
});
