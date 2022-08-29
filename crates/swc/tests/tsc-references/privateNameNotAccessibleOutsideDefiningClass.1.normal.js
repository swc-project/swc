//// [privateNameNotAccessibleOutsideDefiningClass.ts]
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var _foo = /*#__PURE__*/ new WeakMap();
class A {
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: true,
            value: 3
        });
    }
}
new A().#foo = 4; // Error
