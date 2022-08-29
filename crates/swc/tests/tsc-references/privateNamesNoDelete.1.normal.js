//// [privateNamesNoDelete.ts]
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var _v = /*#__PURE__*/ new WeakMap();
class A {
    constructor(){
        _class_private_field_init(this, _v, {
            writable: true,
            value: 1
        });
        delete _class_private_field_get(this, _v); // Error: The operand of a delete operator cannot be a private name.
    }
}
