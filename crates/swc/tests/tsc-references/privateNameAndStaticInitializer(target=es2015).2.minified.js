//// [privateNameAndStaticInitializer.ts]
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
var _foo = new WeakMap(), _prop = new WeakMap();
class A {
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: !0,
            value: void 0
        }), _class_private_field_init(this, _prop, {
            writable: !0,
            value: void 0
        }), _class_private_field_set(this, _foo, 1), _class_private_field_set(this, _prop, 2);
    }
}
A.inst = new A();
