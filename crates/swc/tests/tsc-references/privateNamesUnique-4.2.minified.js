//// [privateNamesUnique-4.ts]
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
class A1 {
}
var _something = new WeakMap();
class C {
    constructor(){
        _class_private_field_init(this, _something, {
            writable: !0,
            value: void 0
        });
    }
}
let c = a;
