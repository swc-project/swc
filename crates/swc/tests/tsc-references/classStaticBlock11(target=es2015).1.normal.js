//// [classStaticBlock11.ts]
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _x = new WeakMap(), __ = new WeakMap();
let getX;
class C {
    constructor(x){
        _class_private_field_init(this, _x, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _x, 1);
        _class_private_field_set(this, _x, x);
    }
}
__.set(C, {
    writable: true,
    value: // getX has privileged access to #x
    getX = (obj)=>obj.#x
});
