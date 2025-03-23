//// [privateNameComputedPropertyName2.ts]
let getX;
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _x = /*#__PURE__*/ new WeakMap();
let _tmp = (getX = (a)=>_class_private_field_get(a, _x), "_");
console.log(getX(new class {
    [_tmp]() {}
    constructor(){
        _class_private_field_init(this, _x, {
            writable: !0,
            value: void 0
        }), _class_private_field_set(this, _x, 100);
    }
}));
