//// [privateNamesNoDelete.ts]
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var _v = new WeakMap();
class A {
    constructor(){
        _class_private_field_init(this, _v, {
            writable: !0,
            value: 1
        }), delete _class_private_field_get(this, _v);
    }
}
