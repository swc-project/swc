//// [privateNameFieldInitializer.ts]
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var _field = new WeakMap(), _uninitialized = new WeakMap();
class A {
    constructor(){
        _class_private_field_init(this, _field, {
            writable: !0,
            value: 10
        }), _class_private_field_init(this, _uninitialized, {
            writable: !0,
            value: void 0
        });
    }
}
