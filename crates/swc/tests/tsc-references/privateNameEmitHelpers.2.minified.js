//// [privateNameEmitHelpers.ts]
//// [main.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _a = new WeakMap(), _b = new WeakSet(), _c = new WeakMap();
export class C {
    constructor(){
        _b.add(this), _c.set(this, {
            get: void 0,
            set: set_c
        }), _class_private_field_init(this, _a, {
            writable: !0,
            value: void 0
        }), _class_private_field_set(this, _a, 1);
    }
}
function set_c(v) {
    _class_private_field_set(this, _a, _class_private_field_get(this, _a) + v);
}
//// [tslib.d.ts]
export { };
