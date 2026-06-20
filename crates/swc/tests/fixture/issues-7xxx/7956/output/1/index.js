import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _a = /*#__PURE__*/ new WeakMap();
class A {
    b() {
        _class_private_field_set(this, _a, _class_private_field_get(this, _a) || 1);
    }
    c(x) {
        var _x;
        _class_private_field_set(_x = x, _a, _class_private_field_get(_x, _a) || 1);
    }
    log() {
        console.log(_class_private_field_get(this, _a));
    }
    constructor(){
        _class_private_field_init(this, _a, {
            writable: true,
            value: void 0
        });
    }
}
const x = new A();
x.b();
x.log();
const y = new A();
y.c(y);
y.log();
