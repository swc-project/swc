//// [privateNamesUnique-4.ts]
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
var _something = new WeakMap();
class A1 {
}
class C {
    constructor(){
        _class_private_field_init(this, _something, {
            writable: true,
            value: void 0
        });
    }
}
const c = a;
