import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
var _myField = /*#__PURE__*/ new WeakMap();
// @target: es2015
class A {
    constructor(){
        _class_private_field_init(this, _myField, {
            writable: true,
            value: "hello world"
        });
        console.log(_class_private_field_get(this, _myField));
    }
}
