//// [privateNameStaticFieldAssignment.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _field = new WeakMap();
class A {
    static getClass() {
        return A;
    }
    constructor(){
        var _A, _A1, _A2, _A3, _A4, _A5, _A6, _A7, _A8, _A9, _A10, _A11, _A_getClass, _A_getClass1, _A_getClass2, _A_getClass3, _A_getClass4, _A_getClass5, _A_getClass6, _A_getClass7, _A_getClass8, _A_getClass9, _A_getClass10, _A_getClass11;
        _class_private_field_set(A, _field, 1);
        _A = A, _class_private_field_set(_A, _field, _class_private_field_get(_A, _field) + 2);
        _A1 = A, _class_private_field_set(_A1, _field, _class_private_field_get(_A1, _field) - 3);
        _A2 = A, _class_private_field_set(_A2, _field, _class_private_field_get(_A2, _field) / 4);
        _A3 = A, _class_private_field_set(_A3, _field, _class_private_field_get(_A3, _field) * 5);
        _A4 = A, _class_private_field_set(_A4, _field, _class_private_field_get(_A4, _field) ** 6);
        _A5 = A, _class_private_field_set(_A5, _field, _class_private_field_get(_A5, _field) % 7);
        _A6 = A, _class_private_field_set(_A6, _field, _class_private_field_get(_A6, _field) << 8);
        _A7 = A, _class_private_field_set(_A7, _field, _class_private_field_get(_A7, _field) >> 9);
        _A8 = A, _class_private_field_set(_A8, _field, _class_private_field_get(_A8, _field) >>> 10);
        _A9 = A, _class_private_field_set(_A9, _field, _class_private_field_get(_A9, _field) & 11);
        _A10 = A, _class_private_field_set(_A10, _field, _class_private_field_get(_A10, _field) | 12);
        _A11 = A, _class_private_field_set(_A11, _field, _class_private_field_get(_A11, _field) ^ 13);
        _class_private_field_set(A.getClass(), _field, 1);
        _A_getClass = A.getClass(), _class_private_field_set(_A_getClass, _field, _class_private_field_get(_A_getClass, _field) + 2);
        _A_getClass1 = A.getClass(), _class_private_field_set(_A_getClass1, _field, _class_private_field_get(_A_getClass1, _field) - 3);
        _A_getClass2 = A.getClass(), _class_private_field_set(_A_getClass2, _field, _class_private_field_get(_A_getClass2, _field) / 4);
        _A_getClass3 = A.getClass(), _class_private_field_set(_A_getClass3, _field, _class_private_field_get(_A_getClass3, _field) * 5);
        _A_getClass4 = A.getClass(), _class_private_field_set(_A_getClass4, _field, _class_private_field_get(_A_getClass4, _field) ** 6);
        _A_getClass5 = A.getClass(), _class_private_field_set(_A_getClass5, _field, _class_private_field_get(_A_getClass5, _field) % 7);
        _A_getClass6 = A.getClass(), _class_private_field_set(_A_getClass6, _field, _class_private_field_get(_A_getClass6, _field) << 8);
        _A_getClass7 = A.getClass(), _class_private_field_set(_A_getClass7, _field, _class_private_field_get(_A_getClass7, _field) >> 9);
        _A_getClass8 = A.getClass(), _class_private_field_set(_A_getClass8, _field, _class_private_field_get(_A_getClass8, _field) >>> 10);
        _A_getClass9 = A.getClass(), _class_private_field_set(_A_getClass9, _field, _class_private_field_get(_A_getClass9, _field) & 11);
        _A_getClass10 = A.getClass(), _class_private_field_set(_A_getClass10, _field, _class_private_field_get(_A_getClass10, _field) | 12);
        _A_getClass11 = A.getClass(), _class_private_field_set(_A_getClass11, _field, _class_private_field_get(_A_getClass11, _field) ^ 13);
    }
}
_field.set(A, {
    writable: true,
    value: 0
});
