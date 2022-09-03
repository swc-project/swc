//// [privateNameFieldAccess.ts]
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var _myField = new WeakMap();
class A {
    constructor(){
        _class_private_field_init(this, _myField, {
            writable: !0,
            value: "hello world"
        }), console.log(_class_private_field_get(this, _myField));
    }
}
