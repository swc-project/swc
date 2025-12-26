//// [privateNameConstructorSignature.ts]
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _x = new WeakMap();
class C {
    static test() {
        _class_private_field_set(new C(), _x, 10);
        const y = new C();
        const z = new y();
        z.x = 123;
    }
    constructor(){
        _class_private_field_init(this, _x, {
            writable: true,
            value: void 0
        });
    }
}
