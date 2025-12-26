//// [privateNameFieldParenthesisLeftAssignment.ts]
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _p = /*#__PURE__*/ new WeakMap();
class Foo {
    t1(p) {
        _class_private_field_set(this, _p, p);
    }
    t2(p) {
        _class_private_field_set(this, _p, p);
    }
    t3(p) {
        _class_private_field_set(this, _p, p);
    }
    t4(p) {
        _class_private_field_set(this, _p, p);
    }
    constructor(value){
        _class_private_field_init(this, _p, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _p, value);
    }
}
