//// [classStaticBlock11.ts]
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _x = new WeakMap();
new WeakMap().set(class {
    constructor(x){
        _class_private_field_init(this, _x, {
            writable: !0,
            value: void 0
        }), _class_private_field_set(this, _x, 1), _class_private_field_set(this, _x, x);
    }
}, {
    writable: !0,
    value: (obj)=>obj.#x
});
