//// [privateNameFieldAccess.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _myField = new WeakMap();
class A {
    constructor(){
        _class_private_field_init(this, _myField, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _myField, "hello world");
        console.log(_class_private_field_get(this, _myField));
    }
}
