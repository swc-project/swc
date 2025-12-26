//// [privateNameFieldAssignment.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _field = new WeakMap();
class A {
    static getInstance() {
        return new A();
    }
    constructor(){
        var _this, _this1, _this2, _this3, _this4, _this5, _this6, _this7, _this8, _this9, _this10, _this11, _A_getInstance, _A_getInstance1, _A_getInstance2, _A_getInstance3, _A_getInstance4, _A_getInstance5, _A_getInstance6, _A_getInstance7, _A_getInstance8, _A_getInstance9, _A_getInstance10, _A_getInstance11;
        _class_private_field_init(this, _field, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _field, 0);
        _class_private_field_set(this, _field, 1);
        _this = this, _class_private_field_set(_this, _field, _class_private_field_get(_this, _field) + 2);
        _this1 = this, _class_private_field_set(_this1, _field, _class_private_field_get(_this1, _field) - 3);
        _this2 = this, _class_private_field_set(_this2, _field, _class_private_field_get(_this2, _field) / 4);
        _this3 = this, _class_private_field_set(_this3, _field, _class_private_field_get(_this3, _field) * 5);
        _this4 = this, _class_private_field_set(_this4, _field, _class_private_field_get(_this4, _field) ** 6);
        _this5 = this, _class_private_field_set(_this5, _field, _class_private_field_get(_this5, _field) % 7);
        _this6 = this, _class_private_field_set(_this6, _field, _class_private_field_get(_this6, _field) << 8);
        _this7 = this, _class_private_field_set(_this7, _field, _class_private_field_get(_this7, _field) >> 9);
        _this8 = this, _class_private_field_set(_this8, _field, _class_private_field_get(_this8, _field) >>> 10);
        _this9 = this, _class_private_field_set(_this9, _field, _class_private_field_get(_this9, _field) & 11);
        _this10 = this, _class_private_field_set(_this10, _field, _class_private_field_get(_this10, _field) | 12);
        _this11 = this, _class_private_field_set(_this11, _field, _class_private_field_get(_this11, _field) ^ 13);
        _class_private_field_set(A.getInstance(), _field, 1);
        _A_getInstance = A.getInstance(), _class_private_field_set(_A_getInstance, _field, _class_private_field_get(_A_getInstance, _field) + 2);
        _A_getInstance1 = A.getInstance(), _class_private_field_set(_A_getInstance1, _field, _class_private_field_get(_A_getInstance1, _field) - 3);
        _A_getInstance2 = A.getInstance(), _class_private_field_set(_A_getInstance2, _field, _class_private_field_get(_A_getInstance2, _field) / 4);
        _A_getInstance3 = A.getInstance(), _class_private_field_set(_A_getInstance3, _field, _class_private_field_get(_A_getInstance3, _field) * 5);
        _A_getInstance4 = A.getInstance(), _class_private_field_set(_A_getInstance4, _field, _class_private_field_get(_A_getInstance4, _field) ** 6);
        _A_getInstance5 = A.getInstance(), _class_private_field_set(_A_getInstance5, _field, _class_private_field_get(_A_getInstance5, _field) % 7);
        _A_getInstance6 = A.getInstance(), _class_private_field_set(_A_getInstance6, _field, _class_private_field_get(_A_getInstance6, _field) << 8);
        _A_getInstance7 = A.getInstance(), _class_private_field_set(_A_getInstance7, _field, _class_private_field_get(_A_getInstance7, _field) >> 9);
        _A_getInstance8 = A.getInstance(), _class_private_field_set(_A_getInstance8, _field, _class_private_field_get(_A_getInstance8, _field) >>> 10);
        _A_getInstance9 = A.getInstance(), _class_private_field_set(_A_getInstance9, _field, _class_private_field_get(_A_getInstance9, _field) & 11);
        _A_getInstance10 = A.getInstance(), _class_private_field_set(_A_getInstance10, _field, _class_private_field_get(_A_getInstance10, _field) | 12);
        _A_getInstance11 = A.getInstance(), _class_private_field_set(_A_getInstance11, _field, _class_private_field_get(_A_getInstance11, _field) ^ 13);
    }
}
