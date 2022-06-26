import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
let getX;
var _x = new WeakMap();
let tmp = (getX = (a)=>_class_private_field_get(a, _x), "_");
console.log(getX(new class {
    [tmp]() {}
    constructor(){
        _class_private_field_init(this, _x, {
            writable: !0,
            value: 100
        });
    }
}));
