//// [classStaticBlock11.ts]
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
let getX;
var _x = new WeakMap();
class C {
    constructor(x){
        _class_private_field_init(this, _x, {
            writable: !0,
            value: 1
        }), _class_private_field_set(this, _x, x);
    }
}
var __ = {
    writable: !0,
    value: void 0
};
