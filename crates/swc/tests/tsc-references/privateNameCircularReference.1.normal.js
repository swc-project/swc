//// [privateNameCircularReference.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _foo = new WeakMap(), _bar = new WeakMap();
class A {
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _bar, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _foo, _class_private_field_get(this, _bar));
        _class_private_field_set(this, _bar, _class_private_field_get(this, _foo));
        this["#baz"] = this["#baz"]; // Error (should *not* be private name error)
    }
}
