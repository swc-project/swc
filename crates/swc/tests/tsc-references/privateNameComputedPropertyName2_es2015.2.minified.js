import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
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
