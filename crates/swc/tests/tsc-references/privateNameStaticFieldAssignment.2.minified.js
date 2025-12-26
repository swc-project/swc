//// [privateNameStaticFieldAssignment.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _field = new WeakMap();
class A {
    static getClass() {
        return A;
    }
    constructor(){
        var _A_getClass, _A_getClass1, _A_getClass2, _A_getClass3, _A_getClass4, _A_getClass5, _A_getClass6, _A_getClass7, _A_getClass8, _A_getClass9, _A_getClass10, _A_getClass11;
        _class_private_field_set(A, _field, 1), _class_private_field_set(A, _field, _class_private_field_get(A, _field) + 2), _class_private_field_set(A, _field, _class_private_field_get(A, _field) - 3), _class_private_field_set(A, _field, _class_private_field_get(A, _field) / 4), _class_private_field_set(A, _field, 5 * _class_private_field_get(A, _field)), _class_private_field_set(A, _field, _class_private_field_get(A, _field) ** 6), _class_private_field_set(A, _field, _class_private_field_get(A, _field) % 7), _class_private_field_set(A, _field, _class_private_field_get(A, _field) << 8), _class_private_field_set(A, _field, _class_private_field_get(A, _field) >> 9), _class_private_field_set(A, _field, _class_private_field_get(A, _field) >>> 10), _class_private_field_set(A, _field, 11 & _class_private_field_get(A, _field)), _class_private_field_set(A, _field, 12 | _class_private_field_get(A, _field)), _class_private_field_set(A, _field, 13 ^ _class_private_field_get(A, _field)), _class_private_field_set(A.getClass(), _field, 1), _class_private_field_set(_A_getClass = A.getClass(), _field, _class_private_field_get(_A_getClass, _field) + 2), _class_private_field_set(_A_getClass1 = A.getClass(), _field, _class_private_field_get(_A_getClass1, _field) - 3), _class_private_field_set(_A_getClass2 = A.getClass(), _field, _class_private_field_get(_A_getClass2, _field) / 4), _class_private_field_set(_A_getClass3 = A.getClass(), _field, 5 * _class_private_field_get(_A_getClass3, _field)), _class_private_field_set(_A_getClass4 = A.getClass(), _field, _class_private_field_get(_A_getClass4, _field) ** 6), _class_private_field_set(_A_getClass5 = A.getClass(), _field, _class_private_field_get(_A_getClass5, _field) % 7), _class_private_field_set(_A_getClass6 = A.getClass(), _field, _class_private_field_get(_A_getClass6, _field) << 8), _class_private_field_set(_A_getClass7 = A.getClass(), _field, _class_private_field_get(_A_getClass7, _field) >> 9), _class_private_field_set(_A_getClass8 = A.getClass(), _field, _class_private_field_get(_A_getClass8, _field) >>> 10), _class_private_field_set(_A_getClass9 = A.getClass(), _field, 11 & _class_private_field_get(_A_getClass9, _field)), _class_private_field_set(_A_getClass10 = A.getClass(), _field, 12 | _class_private_field_get(_A_getClass10, _field)), _class_private_field_set(_A_getClass11 = A.getClass(), _field, 13 ^ _class_private_field_get(_A_getClass11, _field));
    }
}
_field.set(A, {
    writable: !0,
    value: 0
});
