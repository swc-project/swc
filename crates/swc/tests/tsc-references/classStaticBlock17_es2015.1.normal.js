import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
// @target: es2015
let friendA;
var _x = /*#__PURE__*/ new WeakMap();
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
var __ = {
    writable: true,
    value: (()=>{
        friendA = {
            getX (obj) {
                return _class_private_field_get(obj, _x);
            },
            setX (obj, value) {
                _class_private_field_set(obj, _x, value);
            }
        };
    })()
};
class B {
    constructor(a){
        const x = friendA.getX(a); // ok
        friendA.setX(a, x + 1); // ok
    }
}
const a = new A(41);
const b = new B(a);
a.getX();
