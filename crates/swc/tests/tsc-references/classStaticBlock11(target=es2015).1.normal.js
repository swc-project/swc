//// [classStaticBlock11.ts]
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
let getX;
var _x = /*#__PURE__*/ new WeakMap();
class C {
    constructor(x){
        _class_private_field_init(this, _x, {
            writable: true,
            value: 1
        });
        _class_private_field_set(this, _x, x);
    }
}
(()=>{
    // getX has privileged access to #x
    getX = (obj)=>_class_private_field_get(obj, _x);
})();
