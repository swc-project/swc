//// [privateNameNestedClassAccessorsShadowing.ts]
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var _x = new WeakMap();
class Base {
    constructor(){
        _class_private_field_init(this, _x, {
            get: get_x,
            set: void 0
        });
        var _x1 = new WeakMap();
    }
}
function get_x() {
    return 1;
}
