//// [privateNameFieldAssignment.ts]
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
var _field = /*#__PURE__*/ new WeakMap();
class A {
    static getInstance() {
        return new A();
    }
    constructor(){
        var _A_getInstance, _A_getInstance1, _A_getInstance2, _A_getInstance3, _A_getInstance4, _A_getInstance5, _A_getInstance6, _A_getInstance7, _A_getInstance8, _A_getInstance9, _A_getInstance10, _A_getInstance11;
        _class_private_field_init(this, _field, {
            writable: true,
            value: 0
        });
        _class_private_field_set(this, _field, 1);
        _class_private_field_set(this, _field, _class_private_field_get(this, _field) + 2);
        _class_private_field_set(this, _field, _class_private_field_get(this, _field) - 3);
        _class_private_field_set(this, _field, _class_private_field_get(this, _field) / 4);
        _class_private_field_set(this, _field, _class_private_field_get(this, _field) * 5);
        _class_private_field_set(this, _field, Math.pow(_class_private_field_get(this, _field), 6));
        _class_private_field_set(this, _field, _class_private_field_get(this, _field) % 7);
        _class_private_field_set(this, _field, _class_private_field_get(this, _field) << 8);
        _class_private_field_set(this, _field, _class_private_field_get(this, _field) >> 9);
        _class_private_field_set(this, _field, _class_private_field_get(this, _field) >>> 10);
        _class_private_field_set(this, _field, _class_private_field_get(this, _field) & 11);
        _class_private_field_set(this, _field, _class_private_field_get(this, _field) | 12);
        _class_private_field_set(this, _field, _class_private_field_get(this, _field) ^ 13);
        _class_private_field_set(A.getInstance(), _field, 1);
        _class_private_field_set(_A_getInstance = A.getInstance(), _field, _class_private_field_get(_A_getInstance, _field) + 2);
        _class_private_field_set(_A_getInstance1 = A.getInstance(), _field, _class_private_field_get(_A_getInstance1, _field) - 3);
        _class_private_field_set(_A_getInstance2 = A.getInstance(), _field, _class_private_field_get(_A_getInstance2, _field) / 4);
        _class_private_field_set(_A_getInstance3 = A.getInstance(), _field, _class_private_field_get(_A_getInstance3, _field) * 5);
        _class_private_field_set(_A_getInstance4 = A.getInstance(), _field, Math.pow(_class_private_field_get(_A_getInstance4, _field), 6));
        _class_private_field_set(_A_getInstance5 = A.getInstance(), _field, _class_private_field_get(_A_getInstance5, _field) % 7);
        _class_private_field_set(_A_getInstance6 = A.getInstance(), _field, _class_private_field_get(_A_getInstance6, _field) << 8);
        _class_private_field_set(_A_getInstance7 = A.getInstance(), _field, _class_private_field_get(_A_getInstance7, _field) >> 9);
        _class_private_field_set(_A_getInstance8 = A.getInstance(), _field, _class_private_field_get(_A_getInstance8, _field) >>> 10);
        _class_private_field_set(_A_getInstance9 = A.getInstance(), _field, _class_private_field_get(_A_getInstance9, _field) & 11);
        _class_private_field_set(_A_getInstance10 = A.getInstance(), _field, _class_private_field_get(_A_getInstance10, _field) | 12);
        _class_private_field_set(_A_getInstance11 = A.getInstance(), _field, _class_private_field_get(_A_getInstance11, _field) ^ 13);
    }
}
