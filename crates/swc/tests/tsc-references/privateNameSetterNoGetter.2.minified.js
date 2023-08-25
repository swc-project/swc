//// [privateNameSetterNoGetter.ts]
var _x;
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
import { _ as _write_only_error } from "@swc/helpers/_/_write_only_error";
let C = (_x = /*#__PURE__*/ new WeakMap(), class {
    m() {
        _class_private_field_set(this, _x, _write_only_error("#x") + 2); // Error
    }
    constructor(){
        _class_private_field_init(this, _x, {
            get: void 0,
            set: set_x
        });
    }
});
function set_x(x) {}
console.log(new C().m());
