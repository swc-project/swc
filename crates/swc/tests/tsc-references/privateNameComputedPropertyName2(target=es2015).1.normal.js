//// [privateNameComputedPropertyName2.ts]
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _x = new WeakMap();
let _tmp = (getX = (a)=>a.#x, "_");
let getX;
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
