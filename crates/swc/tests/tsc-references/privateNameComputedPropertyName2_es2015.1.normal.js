import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
// @target: esnext, es2022, es2015
let getX;
var _x = /*#__PURE__*/ new WeakMap();
let tmp = (getX = (a)=>_class_private_field_get(a, _x), "_");
class A {
    [tmp]() {}
    constructor(){
        _class_private_field_init(this, _x, {
            writable: true,
            value: 100
        });
    }
}
console.log(getX(new A));
