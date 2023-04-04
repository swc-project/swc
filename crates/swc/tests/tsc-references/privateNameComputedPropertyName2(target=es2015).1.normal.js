//// [privateNameComputedPropertyName2.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
let getX;
var _x = /*#__PURE__*/ new WeakMap();
let _tmp = (getX = (a)=>_class_private_field_get(a, _x), "_");
class A {
    [_tmp]() {}
    constructor(){
        _class_private_field_init(this, _x, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _x, 100);
    }
}
console.log(getX(new A));
