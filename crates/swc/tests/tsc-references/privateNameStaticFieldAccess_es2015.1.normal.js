import _class_static_private_field_spec_get from "@swc/helpers/src/_class_static_private_field_spec_get.mjs";
// @target: es2015
class A {
    constructor(){
        console.log(_class_static_private_field_spec_get(A, A, _myField)); //Ok
        console.log(_class_static_private_field_spec_get(this, A, _myField)); //Error
    }
}
var _myField = {
    writable: true,
    value: "hello world"
};
