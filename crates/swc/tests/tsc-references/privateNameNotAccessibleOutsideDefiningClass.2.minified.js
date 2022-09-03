//// [privateNameNotAccessibleOutsideDefiningClass.ts]
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var _foo = new WeakMap();
class A {
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: !0,
            value: 3
        });
    }
}
new A().#foo = 4;
