//// [classStaticBlock17.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _x = new WeakMap(), __ = new WeakMap();
let friendA;
class A {
    getX() {
        return _class_private_field_get(this, _x);
    }
    constructor(v){
        _class_private_field_init(this, _x, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _x, v);
    }
}
class B {
    constructor(a){
        const x = friendA.getX(a); // ok
        friendA.setX(a, x + 1); // ok
    }
}
const a = new A(41);
const b = new B(a);
a.getX();
