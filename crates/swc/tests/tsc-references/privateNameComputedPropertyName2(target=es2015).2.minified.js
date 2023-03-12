//// [privateNameComputedPropertyName2.ts]
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
var _x = new WeakMap();
console.log(_class_private_field_get(new class {
    _() {}
    constructor(){
        _class_private_field_init(this, _x, {
            writable: !0,
            value: void 0
        }), _class_private_field_set(this, _x, 100);
    }
}, _x));
