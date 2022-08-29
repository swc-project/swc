//// [privateNameMethodClassExpression.ts]
var _field, _method;
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_method_get from "@swc/helpers/src/_class_private_method_get.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
let C = (_field = new WeakMap(), _method = new WeakSet(), class {
    static getInstance() {
        return new C();
    }
    getField() {
        return _class_private_field_get(this, _field);
    }
    constructor(){
        _class_private_method_init(this, _method), _class_private_field_init(this, _field, {
            writable: !0,
            value: _class_private_method_get(this, _method, function() {
                return 42;
            }).call(this)
        });
    }
});
console.log(C.getInstance().getField()), C.getInstance().#method, C.getInstance().#field;
