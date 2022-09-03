//// [classStaticBlock17.ts]
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
let friendA;
var _x = new WeakMap();
class A {
    getX() {
        return _class_private_field_get(this, _x);
    }
    constructor(v){
        _class_private_field_init(this, _x, {
            writable: !0,
            value: void 0
        }), _class_private_field_set(this, _x, v);
    }
}
var __ = {
    writable: !0,
    value: void (friendA = {
        getX: (obj)=>_class_private_field_get(obj, _x),
        setX (obj, value) {
            _class_private_field_set(obj, _x, value);
        }
    })
};
class B {
    constructor(a){
        let x = friendA.getX(a);
        friendA.setX(a, x + 1);
    }
}
let a = new A(41), b = new B(a);
a.getX();
