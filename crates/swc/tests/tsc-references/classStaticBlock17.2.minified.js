//// [classStaticBlock17.ts]
let friendA;
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _x = /*#__PURE__*/ new WeakMap();
friendA = {
    getX: (obj)=>_class_private_field_get(obj, _x),
    setX (obj, value) {
        _class_private_field_set(obj, _x, value);
    }
};
let a = new class {
    getX() {
        return _class_private_field_get(this, _x);
    }
    constructor(v){
        _class_private_field_init(this, _x, {
            writable: !0,
            value: void 0
        }), _class_private_field_set(this, _x, v);
    }
}(41);
new class {
    constructor(a){
        let x = friendA.getX(a);
        friendA.setX(a, x + 1);
    }
}(a), a.getX();
