//// [privateNameBadSuper.ts]
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
class B {
}
var _x = new WeakMap();
class A extends B {
    constructor(){
        super(), _class_private_field_init(this, _x, {
            writable: !0,
            value: void 0
        });
    }
}
