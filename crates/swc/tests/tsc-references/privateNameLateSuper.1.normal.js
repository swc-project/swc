//// [privateNameLateSuper.ts]
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
var _x = new WeakMap();
class B {
}
class A extends B {
    constructor(){
        void 0;
        super();
        _class_private_field_init(this, _x, {
            writable: true,
            value: void 0
        });
    }
}
