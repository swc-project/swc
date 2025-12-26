//// [privateNameFieldInitializer.ts]
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _field = /*#__PURE__*/ new WeakMap(), _uninitialized = /*#__PURE__*/ new WeakMap();
class A {
    constructor(){
        _class_private_field_init(this, _field, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _uninitialized, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _field, 10);
    }
}
