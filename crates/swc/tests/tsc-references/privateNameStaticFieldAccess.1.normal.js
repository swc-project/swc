//// [privateNameStaticFieldAccess.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
var _myField = new WeakMap();
class A {
    constructor(){
        console.log(_class_private_field_get(A, _myField)); //Ok
        console.log(_class_private_field_get(this, _myField)); //Error
    }
}
_myField.set(A, {
    writable: true,
    value: "hello world"
});
