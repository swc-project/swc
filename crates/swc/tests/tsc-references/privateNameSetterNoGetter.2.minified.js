//// [privateNameSetterNoGetter.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
var _x = new WeakMap();
console.log(new class {
    m() {
        _x.get(this).set.call(this, _class_private_field_get(this, _x) + 2);
    }
    constructor(){
        _x.set(this, {
            get: void 0,
            set: set_x
        });
    }
}().m());
