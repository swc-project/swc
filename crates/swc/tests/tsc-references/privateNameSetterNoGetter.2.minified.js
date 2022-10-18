//// [privateNameSetterNoGetter.ts]
var _x;
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
import _write_only_error from "@swc/helpers/src/_write_only_error.mjs";
let C = (_x = new WeakMap(), class {
    m() {
        _class_private_field_set(this, _x, _write_only_error("#x") + 2);
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
