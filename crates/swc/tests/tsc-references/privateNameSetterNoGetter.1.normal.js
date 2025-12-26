//// [privateNameSetterNoGetter.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
var _x = new WeakMap(), _class;
const C = (_class = class {
    m() {
        var _this;
        _this = this, _x.get(_this).set.call(_this, _class_private_field_get(_this, _x) + 2); // Error
    }
    constructor(){
        _x.set(this, {
            get: void 0,
            set: set_x
        });
    }
}, _class);
console.log(new C().m());
