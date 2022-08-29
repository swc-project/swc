//// [privateNameStaticMethodClassExpression.ts]
import _class_static_private_field_spec_get from "@swc/helpers/src/_class_static_private_field_spec_get.mjs";
import _class_static_private_method_get from "@swc/helpers/src/_class_static_private_method_get.mjs";
var _D, _field;
const C = (_D = class D {
    static getClass() {
        return D;
    }
    static getField() {
        return _class_static_private_field_spec_get(C, _D, _field);
    }
}, _field = {
    writable: true,
    value: _class_static_private_method_get(_D, _D, method).call(_D)
}, _D);
console.log(C.getClass().getField());
C.getClass().#method; // Error
C.getClass().#field; // Error
function method() {
    return 42;
}
