// @target: es2015
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var _myField = /*#__PURE__*/ new WeakMap();
class A {
    constructor(){
        _class_private_field_init(this, _myField, {
            writable: true,
            value: "hello world"
        });
        console.log(_class_private_field_get(this, _myField));
    }
}
