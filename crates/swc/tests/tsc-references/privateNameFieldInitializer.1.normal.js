//// [privateNameFieldInitializer.ts]
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
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
