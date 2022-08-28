//// [privateNameMethodClassExpression.ts]
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_method_get from "@swc/helpers/src/_class_private_method_get.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
var _field, _method, _class;
const C = (_field = /*#__PURE__*/ new WeakMap(), _method = /*#__PURE__*/ new WeakSet(), _class = class {
    static getInstance() {
        return new C();
    }
    getField() {
        return _class_private_field_get(this, _field);
    }
    constructor(){
        _class_private_method_init(this, _method);
        _class_private_field_init(this, _field, {
            writable: true,
            value: _class_private_method_get(this, _method, method).call(this)
        });
    }
}, _class);
console.log(C.getInstance().getField());
C.getInstance().#method; // Error
C.getInstance().#field; // Error
function method() {
    return 42;
}
